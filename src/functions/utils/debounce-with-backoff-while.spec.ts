import { getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { debounceTime } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { unitTest } from '~/tests';
import { debounceWithBackoffWhile } from './debounce-with-backoff-while';

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
