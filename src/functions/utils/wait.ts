/**
 * Returns an empty (void) promise that resolves after {time} milliseconds.
 *
 * @param time Time in milliseconds to wait until resolving the promise
 * @return {Promise<void>} Promise resolving after time
 */
export const wait = (time: number): Promise<void> => new Promise<void>(resolve => setTimeout(resolve, time));
