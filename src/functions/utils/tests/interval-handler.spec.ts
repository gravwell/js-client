import { of, VirtualTimeScheduler } from 'rxjs';
import { delayWhen, repeat } from 'rxjs/operators';
import { initDynamicDelay } from '../interval-handler';

fdescribe('delay operator', async () => {
	it('calculates a new delay on every new event', async () => {
		const scheduler = new VirtualTimeScheduler();

		// * search interval settings
		const dynamicDelayProps = {
			intervalStepSize: 500, //0.5 sec // * time do add after each search
			intervalOffset: 4000, //4 sec // * not pass this time
			intervalInitialValue: 1000, // 1s // * await with this value at first call
			scheduler,
		};
		const { dynamicDelay } = initDynamicDelay(dynamicDelayProps);

		const delayedObs$ = of('delayTime').pipe(delayWhen(dynamicDelay));

		let count = 0;

		const delayLogs = new Array<number>();
		delayLogs[0] = scheduler.now();
		delayedObs$
			.pipe(repeat(7))
			// delayed value...delayed value...delay	ed value
			.subscribe(function () {
				delayLogs[count] = scheduler.now() - delayLogs[count];
				count++;
				delayLogs[count] = scheduler.now();
			});

		scheduler.flush();

		const expectedTimes = [1000, 1500, 2000, 2500, 3000, 3500, 4000];
		for (let i = 0; i < expectedTimes.length; i++) {
			expect(delayLogs[i]).withContext('Delay should').toBe(expectedTimes[i]);
		}
	});
	it('resets the delay when shouldReset is called', async () => {
		const scheduler = new VirtualTimeScheduler();

		// * search interval settings
		const dynamicDelayProps = {
			intervalStepSize: 500, //0.5 sec // * time do add after each search
			intervalOffset: 4000, //4 sec // * not pass this time
			intervalInitialValue: 1000, // 1s // * await with this value at first call
			scheduler,
		};
		const { dynamicDelay } = initDynamicDelay(dynamicDelayProps);

		const delayedObs$ = of({ finished: false }).pipe(delayWhen(dynamicDelay));

		let count = 0;

		const delayLogs = new Array<number>();
		delayLogs[0] = scheduler.now();
		delayedObs$
			.pipe(repeat(4))
			// delayed value...delayed value...delay	ed value
			.subscribe(function (data) {
				if (count >= 2 && !data.finished) {
					data.finished = true;
				}
				delayLogs[count] = scheduler.now() - delayLogs[count];
				count++;
				delayLogs[count] = scheduler.now();
			});

		scheduler.flush();

		const expectedTimes = [1000, 1500, 2000, 1000];
		for (let i = 0; i < expectedTimes.length; i++) {
			expect(delayLogs[i]).withContext('Delay should').toBe(expectedTimes[i]);
		}
	});
});
