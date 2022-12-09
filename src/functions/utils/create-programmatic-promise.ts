/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

interface ProgrammaticPromise<T> {
	promise: Promise<T>;
	resolve: (value: T) => void;
	reject: (error: Error) => void;
}

export const createProgrammaticPromise = <T = void>(): ProgrammaticPromise<T> => {
	const obj = {} as ProgrammaticPromise<T>;
	obj.promise = new Promise<T>((_resolve, _reject) => {
		obj.resolve = (value: T) => _resolve(value);
		obj.reject = (error: Error) => _reject(error);
	});
	return obj;
};
