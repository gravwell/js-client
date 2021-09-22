/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { initTestScheduler, getTestScheduler, cold } from 'jasmine-marbles';
import { delayWhen, map } from 'rxjs/operators';
import { DelayHandlerProps, initDynamicDelay } from './interval-handler';

describe('delay operator', async () => {
	// * search interval settings
	// * search interval settings
	const dynamicDelayProps = {
		stepSizeValue: 500, //0.5 sec // * time do add after each search
		offsetValue: 4000, //4 sec // * not pass this time
		initialValue: 1000, // 1s // * await with this value at first call
	} as DelayHandlerProps;

	it('calculates a new delay on every new event', async () => {
		initTestScheduler();

		const scheduler = getTestScheduler();

		const dynamicDelay = initDynamicDelay(dynamicDelayProps);

		scheduler.run(helpers => {
			const { expectObservable } = helpers;
			const source$ = scheduler.createColdObservable('abcdefg').pipe(delayWhen(dynamicDelay));
			const expectedMarble = '1000ms a 500ms b 500ms c 500ms d 500ms e 500ms f 500ms g';
			expectObservable(source$).toBe(expectedMarble);
		});
	});
	it('resets the delay when shouldReset is called', async () => {
		initTestScheduler();

		const scheduler = getTestScheduler();

		const dynamicDelay = initDynamicDelay(dynamicDelayProps);
		let count = 0;
		scheduler.run(helpers => {
			const { expectObservable } = helpers;
			const source$ = cold('abcde').pipe(
				map(v => {
					count++;
					const isFinished = count === 2 ? true : false;
					return { finished: isFinished, value: v };
				}),
				delayWhen(dynamicDelay),
				map(v => v.value),
			);

			const expectedMarble = '1000ms a 0ms b 500ms c 500ms d 500ms e';
			expectObservable(source$).toBe(expectedMarble);
		});
	});
});
