/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { ActionableAction, ActionableTrigger } from './actionable';

export interface ActionableData {
	globalID: UUID;
	id: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string | null;
	menuLabel: null | string;
	labels: Array<string>;

	isGlobal: boolean;
	isDisabled: boolean;

	lastUpdateDate: Date;

	triggers: Array<ActionableTrigger>;
	actions: Array<ActionableAction>;
}
