/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface ScriptLibrariesService {
	readonly get: {
		readonly one: (
			path: string,
			options?: {
				repository?: string | undefined;
				commitID?: string | undefined;
			},
		) => Promise<string>;
	};

	readonly all: () => Promise<void>;
}
