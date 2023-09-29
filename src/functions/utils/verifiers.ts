/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	array as arrayDecoder,
	boolean as booleanDecoder,
	constant as constantDecoder,
	Decoder,
	DecodeResult,
	dict as dictDecoder,
	either as eitherDecoder,
	exact as exactDecoder,
	inexact as inexactDecoder,
	instanceOf as instanceOfDecoder,
	integer as integerDecoder,
	iso8601 as iso8601Decoder,
	json as jsonDecoder,
	jsonArray as jsonArrayDecoder,
	jsonObject as jsonObjectDecoder,
	lazy as lazyDecoder,
	maybe as maybeDecoder,
	nonEmptyArray as nonEmptyArrayDecoder,
	nonEmptyString as nonEmptyStringDecoder,
	null_ as nullDecoder,
	nullable as nullableDecoder,
	number as numberDecoder,
	object as objectDecoder,
	oneOf as oneofDecoder,
	optional as optionalDecoder,
	regex as regexDecoder,
	string as stringDecoder,
	taggedUnion as taggedUnionDecoder,
	tuple as tupleDecoder,
	undefined_ as undefinedDecoder,
	unknown as unknownDecoder,
} from 'decoders';
import { Annotation } from 'decoders/annotate';
import { AcceptanceFn, DecoderType, Scalar } from 'decoders/Decoder';
import { ObjectDecoderType } from 'decoders/lib/objects';
import { DecoderTypes, Values } from 'decoders/lib/unions';
import { Instance, Klass } from 'decoders/lib/utilities';

/**
 * A `Verifier` is a decoder that performs no transforms to the value it
 * inspects.
 *
 * That is, a `Verifier` can tell you if it's possible to decode an unknown
 * value `V` into type `T` without changing the type of `V`. As such, a
 * `Verifier<T>` can work as a `Decoder<T>` AND as a type guard for type `T`.
 */
export interface Verifier<T> extends Decoder<T> {
	/**
	 * Returns true if `value` can be decoded to a `T`, otherwise false.
	 *
	 * Because `guard` asserts that `value` already _is_ a `T` (that is, it can be
	 * decoded to a `T` with no type transforms), `guard` can safely be used as a
	 * type guard for type `T`.
	 */
	guard(value: unknown): value is T;

	/**
	 * Adds an extra rejection predicate to the Verifier.
	 *
	 * @see {@link https://decoders.cc/Decoder.html#reject}
	 */
	rejectVerifier(rejectFn: (value: T) => string | Annotation | null): Verifier<T>;

	/**
	 * Adds an extra acceptance predicate to the Verifier.
	 *
	 * @see {@link https://decoders.cc/Decoder.html#refine}
	 */
	refineVerifier<N extends T>(predicate: (value: T) => value is N, msg: string): Verifier<N>;
	refineVerifier(predicate: (value: T) => boolean, msg: string): Verifier<T>;

	/**
	 * Changes the error message of the Verifier.
	 *
	 * @see {@link https://decoders.cc/Decoder.html#describe}
	 */
	describeVerifier(message: string): Verifier<T>;
}

/**
 * Creates a Verifier from a Decoder. Be careful with this - one should only
 * create a verifier from a decoder if the decoder never changes the type of a
 * decoded value.
 *
 * For example, the following decoders shouldn't be turned into verifiers:
 *
 * - iso8601: Decodes a **string** to a **Date**
 * - numericBoolean: Decodes a **number** to a **boolean**
 * - set: Decodes an **Array<T>** to a **Set<T>**
 */
const verifierFactory = <T>(d: Decoder<T>): Verifier<T> => ({
	guard: (value: unknown): value is T => d.decode(value).ok,
	refineVerifier: <N extends T>(predicate: unknown, msg: string): Verifier<N> =>
		verifierFactory(d.refine(predicate as any, msg)),
	rejectVerifier: (rejectFn: (value: T) => string | Annotation | null): Verifier<T> =>
		verifierFactory(d.reject(rejectFn)),
	describeVerifier: (message: string): Verifier<T> => verifierFactory(d.describe(message)),

	verify: (blob: unknown, formatterFn?: ((ann: Annotation) => string | Error) | undefined): T =>
		d.verify(blob, formatterFn),
	value: (blob: unknown): T | undefined => d.value(blob),
	decode: (blob: unknown): DecodeResult<T> => d.decode(blob),

	refine: <N extends T>(predicate: unknown, msg: string): Decoder<N> => d.refine(predicate as any, msg),
	reject: (rejectFn: (value: T) => string | Annotation | null): Decoder<T> => d.reject(rejectFn),
	describe: (message: string): Decoder<T> => d.describe(message),
	transform: <V>(transformFn: (value: T) => V): Decoder<V> => d.transform(transformFn),
	then: <V>(next: AcceptanceFn<V, T>): Decoder<V> => d.then(next),
	peek_UNSTABLE: <V>(next: AcceptanceFn<V, [unknown, T]>): Decoder<V> => d.peek_UNSTABLE(next),
});

export const string: Verifier<string> = verifierFactory(stringDecoder);

export const regex = (r: RegExp, msg: string): Verifier<string> => verifierFactory(regexDecoder(r, msg));

export const iso8601String: Verifier<string> = verifierFactory(iso8601Decoder.transform(d => d.toISOString()));

export const nonEmptyString: Verifier<string> = verifierFactory(nonEmptyStringDecoder);

export const number: Verifier<number> = verifierFactory(numberDecoder);

export const integer: Verifier<number> = verifierFactory(integerDecoder);

export const boolean: Verifier<boolean> = verifierFactory(booleanDecoder);

export const null_: Verifier<null> = verifierFactory(nullDecoder);

export const undefined_: Verifier<undefined> = verifierFactory(undefinedDecoder);

export const unknown: Verifier<unknown> = verifierFactory(unknownDecoder);

export const mixed: Verifier<unknown> = unknown;

export const jsonObject = verifierFactory(jsonObjectDecoder);

export const jsonArray = verifierFactory(jsonArrayDecoder);

export const json = verifierFactory(jsonDecoder);

export const instanceOf = <K extends Klass<any>>(klass: K): Verifier<Instance<K>> =>
	verifierFactory(instanceOfDecoder(klass));

export const constant = <T extends Scalar>(c: T): Verifier<T> => verifierFactory(constantDecoder(c));

export const optional = <T>(g: Verifier<T>): Verifier<T | undefined> => verifierFactory(optionalDecoder(g));

export const nullable = <T>(g: Verifier<T>): Verifier<T | null> => verifierFactory(nullableDecoder(g));

export const maybe = <T>(g: Verifier<T>): Verifier<T | null | undefined> => verifierFactory(maybeDecoder(g));

export const array = <T>(g: Verifier<T>): Verifier<Array<T>> => verifierFactory(arrayDecoder(g));

export const nonEmptyArray = <T>(g: Verifier<T>): Verifier<[T, ...Array<T>]> =>
	verifierFactory(nonEmptyArrayDecoder(g));

export const tuple1 = <A>(a: Verifier<A>): Verifier<[A]> => verifierFactory(tupleDecoder(a));
export const tuple2 = <A, B>(a: Verifier<A>, b: Verifier<B>): Verifier<[A, B]> => verifierFactory(tupleDecoder(a, b));

export const tuple3 = <A, B, C>(a: Verifier<A>, b: Verifier<B>, c: Verifier<C>): Verifier<[A, B, C]> =>
	verifierFactory(tupleDecoder(a, b, c));

export const tuple4 = <A, B, C, D>(
	a: Verifier<A>,
	b: Verifier<B>,
	c: Verifier<C>,
	d: Verifier<D>,
): Verifier<[A, B, C, D]> => verifierFactory(tupleDecoder(a, b, c, d));

export const tuple5 = <A, B, C, D, E>(
	a: Verifier<A>,
	b: Verifier<B>,
	c: Verifier<C>,
	d: Verifier<D>,
	e: Verifier<E>,
): Verifier<[A, B, C, D, E]> => verifierFactory(tupleDecoder(a, b, c, d, e));

export const exact = <O extends Record<string, Verifier<any>>>(
	VerifiersByKey: O,
): Verifier<{ [K in keyof ObjectDecoderType<O>]: ObjectDecoderType<O>[K] }> =>
	verifierFactory(exactDecoder(VerifiersByKey));

export const object = <O extends Record<string, Verifier<any>>>(
	VerifiersByKey: O,
): Verifier<{ [K in keyof ObjectDecoderType<O>]: ObjectDecoderType<O>[K] }> =>
	verifierFactory(objectDecoder(VerifiersByKey));

export const inexact = <O extends Record<string, Verifier<any>>>(
	VerifiersByKey: O,
): Verifier<{ [K in keyof ObjectDecoderType<O>]: ObjectDecoderType<O>[K] } & Record<string, unknown>> =>
	verifierFactory(inexactDecoder(VerifiersByKey));

export const dict = <T>(v: Verifier<T>): Verifier<Record<string, T>> => verifierFactory(dictDecoder(v));

export const either = <T extends ReadonlyArray<Verifier<any>>>(...vs: T): Verifier<DecoderTypes<T>> =>
	verifierFactory(eitherDecoder(...vs));

export const oneOf = <T extends Scalar>(constants: ReadonlyArray<T>): Verifier<T> =>
	verifierFactory(oneofDecoder(constants));

export const taggedUnion = <O extends Record<string, Verifier<any>>>(
	field: string,
	mapping: O,
): Verifier<Values<{ [key in keyof O]: DecoderType<O[key]> }>> => verifierFactory(taggedUnionDecoder(field, mapping));

export const lazy = <T>(decoderFn: () => Verifier<T>): Verifier<T> => verifierFactory(lazyDecoder(decoderFn));
