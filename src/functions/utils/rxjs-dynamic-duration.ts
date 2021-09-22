/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable, timer } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';
import { createMappableValue } from './create-mappable-value';

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
	mapDuration: (lastDuration: number, event: T, index: number) => number,
	initialDuration = 0,
) => {
	const mappableDuration = createMappableValue(mapDuration, initialDuration);

	// Return duration observable
	return (value: T): Observable<T> => {
		const delayTime = mappableDuration.getValue();
		mappableDuration.next(value);

		return timer(delayTime).pipe(mapTo(value), first());
	};
};
