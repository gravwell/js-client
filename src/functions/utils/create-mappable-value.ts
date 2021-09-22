/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { BehaviorSubject } from 'rxjs';

/**
 * Wrapper around a value that modifies the underlying value using a
 * `mapFunction` every time a new event is sent through `next`.
 */
export interface MappableValue<Value, Event> {
	/** Send the next event to be processed */
	readonly next: (event: Event) => void;

	/** Extract the current value */
	readonly getValue: () => Value;
}

/**
 * Takes a `mapFunction` and an `initialValue` and returns a
 * {@link MappableValue}.
 */
export const createMappableValue = <Value, Event>(
	mapFunction: (lastValue: Value, event: Event, index: number) => Value,
	initialValue: Value,
): MappableValue<Value, Event> => {
	const value$ = new BehaviorSubject(initialValue);
	let index = 0;

	return {
		next: (event: Event): void => {
			const lastValue = value$.getValue();
			const nextValue = mapFunction(lastValue, event, index);
			value$.next(nextValue);
			index++;
		},

		getValue: (): Value => {
			return value$.getValue();
		},
	};
};
