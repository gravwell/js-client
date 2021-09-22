/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable, timer } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';

/**
 * Props to configure the delay
 */
export interface DelayHandlerProps {
	/** every interval that finished !== true, add this value to the timer  */
	stepSizeValue: number;

	/** the timer should not pass that limit */
	offsetValue: number;

	/** initial time value to start delay */
	initialValue: number;
}

/**
 * Initialize timer handler and returns a function
 * that manages the timer and return its value
 */
export const makeDynamicDelay = <T>(
	fn: (lastInterval: number, event: T, index: number) => number,
	initialDelay = 0,
) => {
	let index = 0;
	let delay = initialDelay;

	return {
		next: (event: T): number => {
			delay = fn(delay, event, index);
			index++;
			return delay;
		},
		getValue: (): number => {
			return delay;
		},
		reset: (): number => {
			delay = initialDelay;
			return delay;
		},
	};
};

/**
 * Initialize timer handler and returns a function
 * that manage timer and return your value
 *
 * @example
 * ```ts
 * // The following expressions are equivalent:
 * const dynamicDelay = initDynamicDelay(props);
 * const dynamicDelay = (props: DelayHandlerProps): () => number
 * ```
 *
 * @param 	stepSizeValue - Every interval that finished !== true, add this value to the timer
 * @param 	offsetValue the timer should not pass that limit
 * @param 	initialValue initial timer value
 */
export const rxjsDynamicDuration = <T>(
	fn: (lastDuration: number, event: T, index: number) => number,
	initialDuration = 0,
) => {
	const dynamicDelay = makeDynamicDelay(fn, initialDuration);

	// Return duration observable
	return (value: T): Observable<T> => {
		const delayTime = dynamicDelay.getValue();
		dynamicDelay.next(value);

		return timer(delayTime).pipe(mapTo(value), first());
	};
};
