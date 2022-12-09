/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull } from 'lodash';
import { Observable, timer } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';

/**
 * Returns a function that receives a value and returns that value wrapped in an
 * observable that will emit that value after a certain duration. That duration
 * is calculated by the `mapDuration` parameter.
 *
 * Useful as an utility for other rxjs operators, such as {@link debounce},
 * {@link delayWhen}, {@link concatMap} and so on...
 *
 * @example
 *
 * ```ts
 * const init = Date.now();
 *
 * interval(0)
 * 	.pipe(
 * 		take(4),
 * 		concatMap(
 * 			rxjsDynamicDuration(lastDuration => lastDuration + 500, 1000),
 * 		),
 * 	)
 * 	.subscribe(() => {
 * 		const sinceInit = Date.now() - init;
 * 		console.log(`Milliseconds since init: ${sinceInit}`);
 * 	});
 *
 * // Logs:
 * // Milliseconds since init: 1000
 * // Milliseconds since init: 2500
 * // Milliseconds since init: 4500
 * // Milliseconds since init: 7000
 * ```
 *
 * @param mapDuration Function that calculates the next duration
 * @param initialDuration Initial duration
 */
export const rxjsDynamicDuration = <T>(
	mapDuration: (lastDuration: number, event: T, index: number) => number,
	initialDuration = 0,
) => {
	let index = 0;
	let previousDuration: number | null = null;

	// Return duration observable
	return (value: T): Observable<T> => {
		const duration = isNull(previousDuration) ? initialDuration : mapDuration(previousDuration, value, index);
		previousDuration = duration;
		index++;
		return timer(duration).pipe(mapTo(value), first());
	};
};
