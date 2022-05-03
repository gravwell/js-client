/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export const lazyFirst = <First>(getFirst: () => First) => <F extends (first: First, ...args: Array<any>) => any>(
	f: F,
) => (...args: DropFirst<Parameters<F>>): ReturnType<F> => f(getFirst(), ...args);

export type DropFirst<Args extends Array<any>> = ((...args: Args) => any) extends (arg: any, ...rest: infer Rest) => any
	? Rest
	: Args;

export type GetFirst<Args extends Array<any>> = Args[0];
