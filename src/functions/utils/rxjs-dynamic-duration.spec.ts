/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { concatMap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { unitTest } from '~/tests';
import { rxjsDynamicDuration } from './rxjs-dynamic-duration';

describe(rxjsDynamicDuration.name, () => {
	let scheduler: TestScheduler;

	beforeEach(() => {
		initTestScheduler();
		scheduler = getTestScheduler();
	});

	it(
		'adds 500ms on every new event, starting with 1s',
		unitTest(() => {
			const initialDuration = 1000;
			const source = 'a b c';
			const expected = '1000ms a 1499ms b 1999ms c';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					concatMap(rxjsDynamicDuration(lastDuration => lastDuration + 500, initialDuration)),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'adds 500ms on every new event, never surpassing 1s',
		unitTest(() => {
			const limitDuration = 1000;
			const source = 'a b c d e';
			const expected = 'a 500ms b 999ms c 999ms d 999ms e';

			scheduler.run(({ expectObservable }) => {
				const source$ = scheduler.createColdObservable(source);
				const actual$ = source$.pipe(
					concatMap(rxjsDynamicDuration(lastDuration => Math.min(lastDuration + 500, limitDuration))),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'adds 500ms on every new event, starting with 1s, resets to 1s after the 2nd event',
		unitTest(() => {
			const initialDuration = 1000;
			const source = 'a b c d e';
			const expected = '1000ms a 1499ms b 1999ms c 999ms d 1499ms e';
			const resetAfterEvent = 2;

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					concatMap(
						rxjsDynamicDuration((lastDuration, _event, index) => {
							// Reset the duration to the initial value after the second event
							if (index === resetAfterEvent) {
								return initialDuration;
							}

							return lastDuration + 500;
						}, initialDuration),
					),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);
});
