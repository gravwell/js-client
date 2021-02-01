/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

/**
 * A delay function to use while testing.
 *
 * ```ts
 * // sleep for a second
 * await sleep(1000);
 * ```
 *
 * @param ms The number of milliseconds to wait
 */
export const sleep = (ms: number): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	});
};
