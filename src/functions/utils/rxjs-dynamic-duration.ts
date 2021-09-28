/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull } from 'lodash';
import { MonoTypeOperatorFunction, Observable, timer } from 'rxjs';
import { debounce, first, mapTo } from 'rxjs/operators';

/**
 * Returns a function that receives a value and returns that value wrapped in an observable that
 * will emit that value after a certain duration. That duration is calculated by the `mapDuration`
 * parameter.
 *
 * Useful as an utility for other rxjs operators, such as {@link debounce}, {@link delayWhen},
 * {@link concatMap} and so on...
 *
 * @example
 * ```ts
 * const init = Date.now()
 *
 * interval(0).pipe(
 *   take(4),
 *   concatMap(rxjsDynamicDuration(lastDuration => lastDuration + 500, 1000)),
 * ).subscribe(() => {
 *   const sinceInit = Date.now() - init
 *   console.log(`Milliseconds since init: ${ sinceInit }`)
 * })
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

/**
 * `debounceWithBackoff` works like `debounceTime`, but uses a backoff strategy to increase the dueTime as the source
 * Observable emits notifications.
 *
 * That is, `debounceWithBackoff` delays notifications emitted by the source Observable, dropping cached notifications
 * and restarting timers as new notifications arrive from the source. The rules for hanging on to cached notifications
 * and handling complete/error are the same as `debounceTime`.
 *
 * `debounceWithBackoff` starts with a dueTime of `initialDueTime` and increments the dueTime by `step`
 * to a maximum of `maxDueTime` as long as `predicate(value)` returns true for each `value` emitted by the source.
 *
 * If `predicate(value)` returns false for a given `value`, the dueTime is reset to `initialDueTime` for that notification.
 *
 * In other words, `debounceWithBackoffWhile({initialDueTime: 1000, step:..., maxDueTime: ..., predicate: () => false})`
 * is functionally equivalent to `debounceTime(1000)`.
 *
 * @returns A function that returns an Observable that delays the emissions of the source Observable by the
 * specified duration Observable returned by durationSelector, and may drop some values if they occur too frequently.
 */
export const debounceWithBackoffWhile = <T>({
	initialDueTime,
	step,
	maxDueTime,
	predicate,
}: {
	initialDueTime: number;
	step: number;
	maxDueTime: number;
	predicate: (value: T) => boolean;
}): MonoTypeOperatorFunction<T> => {
	const nextDueTime = (lastDueTime: number, value: T) => {
		if (!predicate(value)) {
			return initialDueTime;
		}
		return Math.min(lastDueTime + step, maxDueTime);
	};

	return (source: Observable<T>): Observable<T> =>
		source.pipe(debounce(rxjsDynamicDuration(nextDueTime, initialDueTime)));
};
