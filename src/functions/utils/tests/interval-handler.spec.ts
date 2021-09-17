import { of } from 'rxjs';
import { delayWhen, repeat } from 'rxjs/operators';
import { sleep } from '~/tests';
import { initDynamicDelay } from '../interval-handler';

describe('delay operator', async () => {
	it('calculates a new delay on every new event', async () => {
		// * search interval settings
		const dynamicDelayProps = {
			intervalStepSize: 500, //0.5 sec // * time do add after each search
			intervalOffset: 4000, //4 sec // * not pass this time
			intervalInitialValue: 1000, // 1s // * await with this value at first call
		};
		const { dynamicDelay } = initDynamicDelay(dynamicDelayProps);

		const delayedObs$ = of('delayTime').pipe(delayWhen(dynamicDelay));

		let count = 0;

		const delayLogs = new Array<number>();
		delayLogs[0] = Date.now();
		delayedObs$
			.pipe(repeat(7))
			// delayed value...delayed value...delay	ed value
			.subscribe(function () {
				delayLogs[count] = Date.now() - delayLogs[count];
				count++;
				delayLogs[count] = Date.now();
			});

		await sleep(18000);

		const expectedTimes = [1000, 1500, 2000, 2500, 3000, 3500, 4000];
		for (let i = 0; i < expectedTimes.length; i++) {
			expect(delayLogs[i]).withContext('Delay should').toBeGreaterThanOrEqual(expectedTimes[i]);
		}
	}, 25000);
	fit('resets the delay when shouldReset is called', async () => {
		// * search interval settings
		const dynamicDelayProps = {
			intervalStepSize: 500, //0.5 sec // * time do add after each search
			intervalOffset: 4000, //4 sec // * not pass this time
			intervalInitialValue: 1000, // 1s // * await with this value at first call
		};
		const { dynamicDelay } = initDynamicDelay(dynamicDelayProps);

		const delayedObs$ = of({ finished: false }).pipe(delayWhen(dynamicDelay));

		let count = 0;

		const delayLogs = new Array<number>();
		delayLogs[0] = Date.now();
		delayedObs$
			.pipe(repeat(4))
			// delayed value...delayed value...delay	ed value
			.subscribe(function (data) {
				if (count >= 2 && !data.finished) {
					data.finished = true;
				}
				delayLogs[count] = Date.now() - delayLogs[count];
				count++;
				delayLogs[count] = Date.now();
			});

		await sleep(6000);

		const expectedTimes = [1000, 1500, 2000, 1000];
		for (let i = 0; i < expectedTimes.length; i++) {
			expect(delayLogs[i]).withContext('Delay should').toBeGreaterThanOrEqual(expectedTimes[i]);
		}
	}, 25000);
});
