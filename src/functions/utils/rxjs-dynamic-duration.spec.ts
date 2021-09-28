/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { concatMap, debounceTime } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { unitTest } from '~/tests';
import { debounceWithBackoffWhile, rxjsDynamicDuration } from './rxjs-dynamic-duration';

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

describe(debounceWithBackoffWhile.name, () => {
	let scheduler: TestScheduler;

	beforeEach(() => {
		initTestScheduler();
		scheduler = getTestScheduler();
	});

	it(
		'debounces the first thing',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//  1000 |  done | a emits
			const source = 'a';
			const expected = '1000ms a';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({ initialDueTime: 1000, step: 500, maxDueTime: 4000, predicate: () => true }),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'debounces the first thing (zero init)',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |     0 | a starts a 1000ms timer
			//     0 |  done | a emits
			const source = 'a';
			const expected = 'a';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({ initialDueTime: 0, step: 500, maxDueTime: 4000, predicate: () => true }),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'causes 3 debounces, then let the item through',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//     1 |  1500 | b cancels a's timer, starts 1500ms timer
			//     2 |  2000 | c cancels b's timer, starts 2000ms timer
			//  2002 |  done | c emits
			const source = 'a b c';
			const expected = '2002ms c';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({ initialDueTime: 1000, step: 500, maxDueTime: 4000, predicate: () => true }),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'causes a debounce, then lets the item through',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//     1 |  1500 | b cancels a's timer, starts 1500ms timer
			//  1501 |  done | b emits
			//  1502 |  2000 | c starts a 2000ms timer
			//  3502 |  done | c emits
			const source = 'a b 1500ms c';
			const expected = '1501ms b 2000ms c';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({ initialDueTime: 1000, step: 500, maxDueTime: 4000, predicate: () => true }),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'respects the max debounce time',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//     1 |  1500 | b cancels a's timer, starts 1500ms timer
			//     2 |  2000 | c cancels b's timer, starts 2000ms timer
			//     3 |  2500 | d cancels c's timer, starts 2500ms timer
			//     4 |  3000 | e cancels d's timer, starts 3000ms timer
			//     5 |  3500 | f cancels e's timer, starts 3500ms timer
			//     6 |  4000 | g cancels f's timer, starts 4000ms timer
			//     7 |  4000 | h cancels g's timer, starts 4000ms timer
			//     8 |  4000 | i cancels h's timer, starts 4000ms timer
			//     9 |  4000 | j cancels i's timer, starts 4000ms timer
			//  4009 |  done | j emits
			const source = 'a b c d e f g h i j';
			const expected = '4009ms j';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({ initialDueTime: 1000, step: 500, maxDueTime: 4000, predicate: () => true }),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'resets the backoff correctly',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//     1 |  1500 | b cancels a's timer, starts 1500ms timer
			//     2 |  2000 | c cancels b's timer, starts 2000ms timer
			//     3 |  2500 | d cancels c's timer, starts 2500ms timer
			//     4 |  3000 | e cancels d's timer, starts 3000ms timer
			//     5 |  3500 | f cancels e's timer, starts 3500ms timer
			//     6 |  4000 | g cancels f's timer, starts 4000ms timer
			//     7 |  4000 | h cancels g's timer, starts 4000ms timer
			//     8 |  4000 | i cancels h's timer, starts 4000ms timer
			//     9 |  1000 | j cancels i's timer, resets the backoff, starts 1000ms timer
			//    10 |  1500 | k cancels j's timer, starts 1500ms timer
			//    11 |  2000 | l cancels k's timer, starts 2000ms timer
			//    12 |  2500 | m cancels l's timer, starts 2500ms timer
			//    13 |  1000 | n cancels m's timer, resets the backoff, starts 1000ms timer
			//    14 |  1500 | o cancels n's timer, starts 1500ms timer
			//  1514 |  done | n emits
			const source = 'a b c d e f g h i j k l m n o';
			const expected = '1514ms o';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({
						initialDueTime: 1000,
						step: 500,
						maxDueTime: 4000,
						predicate: val => val !== 'j' && val !== 'n', // increase backoff while val is neither 'j' nor 'n'
					}),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'handles complete',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//     1 |  1500 | b cancels a's timer, starts 1500ms timer
			//     2 |  2000 | c cancels b's timer, starts 2000ms timer
			//     3 |  done | The latest cached thing is emitted, then completed
			const source = 'a b c |';
			const expected = '3ms (c|)';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({ initialDueTime: 1000, step: 500, maxDueTime: 4000, predicate: () => true }),
				);
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'can be used like debounceTime',
		unitTest(() => {
			// Clock | Timer | What?
			//     0 |  1000 | a starts a 1000ms timer
			//   101 |  1000 | b cancels a's timer, starts 1000ms timer
			//   302 |  1000 | c cancels b's timer, starts 1000ms timer
			//   603 |  1000 | d cancels c's timer, starts 1000ms timer
			//  1004 |  1000 | e cancels d's timer, starts 1000ms timer
			//  1505 |  1000 | f cancels e's timer, starts 1000ms timer
			//  2106 |  1000 | g cancels f's timer, starts 1000ms timer
			//  3106 |  done | g emits
			const source = 'a 100ms b 200ms c 300ms d 400ms e 500ms f 600ms g';
			const expected = '3106ms g';

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(
					debounceWithBackoffWhile({
						initialDueTime: 1000,
						step: 500,
						maxDueTime: 4000,
						predicate: () => false, // Never increase the backoff
					}),
				);
				expectObservable(actual$).toBe(expected);

				// debounceTime should work the same way
				const actualDebounceTime$ = source$.pipe(debounceTime(1000));
				expectObservable(actualDebounceTime$).toBe(expected);
			});
		}),
	);
});
