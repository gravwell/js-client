/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { cold, getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { delayWhen, map } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { unitTest } from '~/tests';
import { DelayHandlerProps, initDynamicDelay } from './interval-handler';

describe('delay operator', () => {
	let scheduler: TestScheduler;

	beforeEach(() => {
		initTestScheduler();
		scheduler = getTestScheduler();
	});

	it(
		'calculates a new delay on every new event',
		unitTest(() => {
			const source = 'abcdefg';
			const expected = '1000ms a 500ms b 500ms c 500ms d 500ms e 500ms f 500ms g';

			const dynamicDelayProps: DelayHandlerProps = {
				stepSizeValue: 500, //0.5 sec // * time do add after each search
				offsetValue: 4000, //4 sec // * not pass this time
				initialValue: 1000, // 1s // * await with this value at first call
			};
			const dynamicDelay = initDynamicDelay(dynamicDelayProps);

			scheduler.run(({ expectObservable }) => {
				const source$ = scheduler.createColdObservable(source);
				const actual$ = source$.pipe(delayWhen(dynamicDelay));
				expectObservable(actual$).toBe(expected);
			});
		}),
	);

	it(
		'resets the delay when shouldReset is called',
		unitTest(() => {
			const source = 'abcde';
			const expected = '1000ms a 0ms b 500ms c 500ms d 500ms e';

			const dynamicDelayProps: DelayHandlerProps = {
				stepSizeValue: 500, //0.5 sec // * time do add after each search
				offsetValue: 4000, //4 sec // * not pass this time
				initialValue: 1000, // 1s // * await with this value at first call
			};
			const dynamicDelay = initDynamicDelay(dynamicDelayProps);

			scheduler.run(({ expectObservable }) => {
				const source$ = cold(source);

				let count = 0;
				const actual$ = source$.pipe(
					map(v => {
						count++;
						const isFinished = count === 2 ? true : false;
						return { finished: isFinished, value: v };
					}),
					delayWhen(dynamicDelay),
					map(v => v.value),
				);

				expectObservable(actual$).toBe(expected);
			});
		}),
	);
});
