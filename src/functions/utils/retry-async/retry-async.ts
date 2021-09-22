import { retryAsyncLazy } from './retry-async-lazy';
import { RetryAsyncOptions } from './retry-async-options';

type RetryAsync = <T>(fn: () => Promise<T>, options?: RetryAsyncOptions) => Promise<T>;

export const retryAsync: RetryAsync = <T>(fn: () => Promise<T>, options: RetryAsyncOptions = {}): Promise<T> => {
	const run = retryAsyncLazy(fn, options);
	return run();
};
