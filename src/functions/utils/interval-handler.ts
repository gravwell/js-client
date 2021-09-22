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
export const initIntervalHandler = ({ stepSizeValue, offsetValue, initialValue }: DelayHandlerProps) => {
	let interval = initialValue;

	// Add step to interval
	const addStep = () => {
		// Add step
		interval += stepSizeValue;

		// Limit the interval
		if (interval >= offsetValue) interval = offsetValue;
	};

	const getIntervalTime = () => {
		return interval;
	};

	// Set interval to the initial value
	const resetInterval = () => {
		interval = initialValue;
	};

	return { addStep, getIntervalTime, resetInterval };
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
export const initDynamicDelay = ({ stepSizeValue, offsetValue, initialValue }: DelayHandlerProps) => {
	const { getIntervalTime, resetInterval, addStep } = initIntervalHandler({ stepSizeValue, offsetValue, initialValue });

	// return delay observable
	const dynamicDelay = <T>(value: T): Observable<T> => {
		if (typeof value === 'object') {
			const data = (value as unknown) as object & { finished?: boolean };
			if (data?.finished) resetInterval();
		}

		const delayTime = getIntervalTime();
		addStep();
		console.log({ delayTime });

		return timer(delayTime).pipe(mapTo(value), first());
	};

	return dynamicDelay;
};
