/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup, Group, UpdatableGroup } from '~/models/group';
import { NumericID } from '~/value-objects';

export interface GroupsService {
	readonly create: {
		readonly one: (data: CreatableGroup) => Promise<Group>;
	};

	readonly delete: {
		readonly one: (groupID: string) => Promise<void>;
	};

	readonly get: {
		readonly one: (groupID: string) => Promise<Group>;
		readonly many: (groupFilter?: { userID?: string | undefined }) => Promise<Array<Group>>;
		readonly all: () => Promise<Array<Group>>;
	};

	readonly update: {
		readonly one: (data: UpdatableGroup) => Promise<Group>;
	};

	readonly addUserTo: {
		readonly one: (userID: NumericID, groupID: NumericID) => Promise<void>;
		readonly many: (userID: string, groupIDs: Array<string>) => Promise<void>;
	};

	readonly removeUserFrom: {
		readonly one: (userID: string, groupID: string) => Promise<void>;
	};
}
