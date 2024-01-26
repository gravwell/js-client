/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { concatMap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { unitTest } from '~/tests/test-types';
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
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//  1000 |  1500 | a emits, b starts 1500ms timer
			//  2500 |  2000 | b emits, c starts a 2000ms timer
			//  4500 |     - | c emits, completes
			const initialDuration = 1000;
			const source = 'a b c |';
			const expected = '1000ms a 1499ms b 1999ms (c|)';

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
			// Clock | Timer | What?
			//     0 |     0 | a starts a 0ms timer
			//     0 |     - | a emits
			//     1 |   500 | b starts 500ms timer
			//   501 |  1000 | b emits, c starts a 1000ms timer
			//  1501 |  1000 | c emits, d starts a 1000ms timer
			//  2501 |  1000 | d emits, e starts a 1000ms timer
			//  3501 |     - | e emits, completes
			const limitDuration = 1000;
			const source = 'a b c d e |';
			const expected = 'a 500ms b 999ms c 999ms d 999ms (e|)';

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
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//  1000 |  1500 | a emits, b starts 1500ms timer
			//  2500 |  1000 | b emits, c starts a 1000ms timer because it's index 2
			//  3500 |  1500 | c emits, d starts a 1500ms timer
			//  5000 |  2000 | d emits, e starts a 2000ms timer
			//  7000 |     - | e emits, completes
			const initialDuration = 1000;
			const source = 'a b c d e |';
			const expected = '1000ms a 1499ms b 999ms c 1499ms d 1999ms (e|)';
			const resetAfterEvent = 2;

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					concatMap(
						rxjsDynamicDuration((lastDuration, _event, index) => {
							// Reset the duration to the initial value on the second event
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
