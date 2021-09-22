import { wait } from '../wait';
import { cleanRetryAsyncOptions, RetryAsyncOptions } from './retry-async-options';

type RetryAsyncLazy = <T>(fn: () => Promise<T>, options?: RetryAsyncOptions) => () => Promise<T>;

export const retryAsyncLazy: RetryAsyncLazy = <T>(fn: () => Promise<T>, options: RetryAsyncOptions = {}) => {
	const { attempts: maxAttempts, interval, debug }: Required<RetryAsyncOptions> = cleanRetryAsyncOptions(options);

	const debugLog = (...args: Array<any>) => {
		if (debug) {
			console.log(...args);
		}
	};

	debugLog(
		`Will return a function to try the given function up to ${maxAttempts} times in intervals of ${interval}ms`,
		fn,
	);

	return async (): Promise<T> => {
		let lastError: any;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				const result = await fn();
				debugLog(`Success on attempt ${attempt} of ${maxAttempts}`, result);
				return result;
			} catch (err) {
				debugLog(`Failure on attempt ${attempt} of ${maxAttempts}`, err);
				lastError = err;
				await wait(interval);
			}
		}
		throw lastError;
	};
};
