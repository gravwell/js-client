import { timer } from 'rxjs';

//Types
interface IntervalHandlerProps {
	intervalStepSize: number;
	intervalOffset: number;
	intervalInitialValue: number;
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
		interval = intervalInitialValue;
	};
	return { getIntervalTime, resetInterval };
};

export const initDynamicDelay = ({ intervalStepSize, intervalOffset, intervalInitialValue }: IntervalHandlerProps) => {
	const { getIntervalTime, resetInterval } = initIntervalHandler({
		intervalStepSize,
		intervalOffset,
		intervalInitialValue,
	});

	//return delay observable
	//TODO: type this
	const dynamicDelay = <T>(event: any) => {
		if (event?.finished) resetInterval();
		const delayTime = getIntervalTime();
		return timer(delayTime);
	};
	return { dynamicDelay, resetInterval };
};
