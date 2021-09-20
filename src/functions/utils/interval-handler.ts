import { timer, VirtualTimeScheduler } from 'rxjs';

//Types
interface IntervalHandlerProps {
	intervalStepSize: number;
	intervalOffset: number;
	intervalInitialValue: number;
	scheduler?: VirtualTimeScheduler;
}

// Implementations
export const initIntervalHandler = ({
	intervalStepSize,
	intervalOffset,
	intervalInitialValue,
}: IntervalHandlerProps) => {
	let interval = intervalInitialValue - intervalStepSize;
	const getIntervalTime = () => {
		if (interval < intervalOffset) interval += intervalStepSize;
		return interval;
	};
	const resetInterval = () => {
		interval = intervalInitialValue - intervalStepSize;
	};
	return { getIntervalTime, resetInterval };
};

export const initDynamicDelay = ({
	intervalStepSize,
	intervalOffset,
	intervalInitialValue,
	scheduler,
}: IntervalHandlerProps) => {
	const { getIntervalTime, resetInterval } = initIntervalHandler({
		intervalStepSize,
		intervalOffset,
		intervalInitialValue,
	});

	//return delay observable
	const dynamicDelay = <T>(event: any) => {
		if (event?.finished) resetInterval();
		const delayTime = getIntervalTime();

		if (scheduler) return timer(delayTime, scheduler);

		return timer(delayTime);
	};
	return { dynamicDelay };
};
