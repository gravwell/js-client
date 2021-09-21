/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { timer } from 'rxjs';

/**
 * Props to configure the delay
 *
 * @param 	stepSizeValue every interval that finished !== true, add this value to the timer
 * @param 	offsetValue the timer should not pass that limit
 * @param 	initialValue initial time value to start delay
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
 *
 *
 * @param 	stepSizeValue - Every interval that finished !== true, add this value to the timer
 * @param 	offsetValue the timer should not pass that limit
 * @param 	initialValue initial timer value
 */
export const initIntervalHandler = ({ stepSizeValue, offsetValue, initialValue }: DelayHandlerProps) => {
	let interval = initialValue - stepSizeValue;
	const getIntervalTime = () => {
		if (interval < offsetValue) interval += stepSizeValue;
		return interval;
	};
	const resetInterval = () => {
		interval = initialValue - stepSizeValue;
	};
	return { getIntervalTime, resetInterval };
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
	const { getIntervalTime, resetInterval } = initIntervalHandler({ stepSizeValue, offsetValue, initialValue });

	//return delay observable
	const dynamicDelay = <T>(value: T) => {
		if (typeof value === 'object') {
			const data = (value as unknown) as object & { finished?: boolean };
			if (data?.finished) resetInterval();
		}
		const delayTime = getIntervalTime();

		return timer(delayTime);
	};
	return dynamicDelay;
};
