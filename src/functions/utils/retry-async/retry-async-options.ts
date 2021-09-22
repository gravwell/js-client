export interface RetryAsyncOptions {
	/**
	 * Maximum inclusive number of attempts before rejecting.
	 * @type {number} Number, integer, >=1, defaults to 2
	 */
	attempts?: number;

	/**
	 * Time in milliseconds between each attempt.
	 * @type {number} Number, integer, >=0, defaults to 200
	 */
	interval?: number;

	/**
	 * Whether it should log to the console.
	 * @type {boolean} Boolean, defaults to false
	 */
	debug?: boolean;
}

const DEFAULT_OPTIONS: Required<RetryAsyncOptions> = {
	attempts: 2,
	interval: 200,
	debug: false,
};

export const cleanRetryAsyncOptions = (given: RetryAsyncOptions): Required<RetryAsyncOptions> => {
	if (given.attempts !== undefined) {
		if (typeof given.attempts !== 'number') {
			throw Error(`options.attempts should be a number`);
		}
		if (given.attempts < 1) {
			throw Error(`options.attempts should be >= 1`);
		}
		if (!Number.isInteger(given.attempts)) {
			throw Error(`options.attempts should be an integer`);
		}
	}

	if (given.interval !== undefined) {
		if (typeof given.interval !== 'number') {
			throw Error(`options.interval should be a number`);
		}
		if (given.interval < 0) {
			throw Error(`options.interval should be >= 0`);
		}
		if (!Number.isInteger(given.interval)) {
			throw Error(`options.interval should be an integer`);
		}
	}

	if (given.debug !== undefined) {
		if (typeof given.debug !== 'boolean') {
			throw Error(`options.debug should be a boolean`);
		}
	}

	return { ...DEFAULT_OPTIONS, ...given };
};
