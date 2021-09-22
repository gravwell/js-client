/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { concatMap, map } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { unitTest } from '~/tests';
import { dynamicDuration } from './interval-handler';

describe('delay operator', () => {
	let scheduler: TestScheduler;

	beforeEach(() => {
		initTestScheduler();
		scheduler = getTestScheduler();
	});

	it(
		'adds the step value on every new event',
		unitTest(() => {
			const source = 'a b c';
			const expected = '1000ms a 1499ms b 1999ms c';

			const dynamicDelay = dynamicDuration(lastInterval => Math.min(lastInterval + 500, 4000), 1000);

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(concatMap(dynamicDelay));
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'does not surpass the limit',
		unitTest(() => {
			const source = 'a b c d e';
			const expected = '1000ms a 1499ms b 1999ms c 1999ms d 1999ms e';

			const dynamicDelay = dynamicDuration(lastInterval => Math.min(lastInterval + 500, 2000), 1000);

			scheduler.run(({ expectObservable }) => {
				const source$ = scheduler.createColdObservable(source);
				const actual$ = source$.pipe(concatMap(dynamicDelay));
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'resets the delay when shouldReset is called',
		unitTest(() => {
			const source = 'a b c d e';
			const expected = '1000ms a 1499ms b 1999ms c 999ms d 1499ms e';
			const resetAfterEvent = 2;

			const dynamicDelay = dynamicDuration((lastInterval, _event, index) => {
				// Reset the duration to the initial value after the second event
				if (index === resetAfterEvent) {
					return 1000;
				}

				return Math.min(lastInterval + 500, 4000);
			}, 1000);

			scheduler.run(({ expectObservable, cold }) => {
				const source$ = cold(source);
				const actual$ = source$.pipe(concatMap(dynamicDelay));
				expectObservable(actual$).toBe(expected);
			});
		}),
	);
});
