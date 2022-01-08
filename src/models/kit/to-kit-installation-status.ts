/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Percentage, toNumericID } from '~/value-objects';
import { KitInstallationStatus } from './kit-installation-status';
import { RawKitInstallationStatus } from './raw-kit-installation-status';

export const toKitInstallationStatus = (raw: RawKitInstallationStatus): KitInstallationStatus => ({
	id: toNumericID(raw.InstallID),
	userID: toNumericID(raw.Owner),

	percentage: Percentage.from(raw.Percentage),
	isDone: raw.Done,

	logs: raw.Log.split('\n')
		.map(l => l.trim())
		.filter(l => l.length > 0),
	error: raw.Error === '' ? null : raw.Error,

	lastUpdateDate: new Date(raw.Updated),
});
