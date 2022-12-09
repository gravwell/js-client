/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

export interface ScriptLibrariesService {
	readonly get: {
		/** Retrieves the code to a specific script library. */
		readonly one: (
			path: string,
			options?: {
				repository?: string | undefined;
				commitID?: string | undefined;
			},
		) => Promise<string>;
	};

	readonly sync: {
		/**
		 * Updates all libraries to their latest versions. The promise resolves when
		 * the command to sync them is successfully received by the backend, not we
		 * they're all synced.
		 */
		readonly all: () => Promise<void>;
	};
}
