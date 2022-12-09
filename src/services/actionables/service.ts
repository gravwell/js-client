/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Actionable, CreatableActionable, UpdatableActionable } from '~/models/actionable';

export interface ActionablesService {
	readonly get: {
		readonly one: (actionableID: string) => Promise<Actionable>;
		readonly all: () => Promise<Array<Actionable>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Actionable>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableActionable) => Promise<Actionable>;
	};

	readonly update: {
		readonly one: (data: UpdatableActionable) => Promise<Actionable>;
	};

	readonly delete: {
		readonly one: (actionableID: string) => Promise<void>;
	};
}
