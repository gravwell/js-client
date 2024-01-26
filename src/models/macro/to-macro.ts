/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models/data-type';
import { toNumericID } from '~/value-objects/id';
import { Macro } from './macro';
import { RawMacro } from './raw-macro';

export const toMacro = (raw: RawMacro): Macro => ({
	_tag: DATA_TYPE.MACRO,
	id: toNumericID(raw.ID),
	userID: toNumericID(raw.UID),
	groupIDs: raw.GIDs?.map(toNumericID) ?? [],
	isGlobal: raw.Global ?? false,

	name: raw.Name,
	description: raw.Description.trim() === '' ? null : raw.Description,
	labels: raw.Labels ?? [],

	expansion: raw.Expansion,

	lastUpdateDate: new Date(raw.LastUpdated),
});
