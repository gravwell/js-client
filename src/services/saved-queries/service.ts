/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableSavedQuery, SavedQuery, UpdatableSavedQuery } from '~/models/saved-query';

export interface SavedQueriesService {
	readonly get: {
		readonly one: (savedQueryID: string) => Promise<SavedQuery>;
		readonly all: () => Promise<Array<SavedQuery>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<SavedQuery>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableSavedQuery) => Promise<SavedQuery>;
	};

	readonly update: {
		readonly one: (data: UpdatableSavedQuery) => Promise<SavedQuery>;
	};

	readonly delete: {
		readonly one: (savedQueryID: string) => Promise<void>;
	};
}
