/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	CreatableResource,
	Resource,
	ResourceContentPreview,
	UpdatableResource,
} from '~/models/resource';

export interface ResourcesService {
	readonly get: {
		readonly one: (resourceID: string) => Promise<Resource>;
		readonly all: () => Promise<Array<Omit<Resource, 'body'>>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Omit<Resource, 'body'>>>;
		};
	};

	readonly preview: {
		readonly one: (
			resourceID: string,
			options?: {
				bytes?: number | undefined;
			},
		) => Promise<ResourceContentPreview>;
	};

	readonly create: {
		readonly one: (data: CreatableResource) => Promise<Resource>;
	};

	readonly update: {
		readonly one: (data: UpdatableResource) => Promise<Resource>;
	};

	readonly delete: {
		readonly one: (resourceID: string) => Promise<void>;
	};
}
