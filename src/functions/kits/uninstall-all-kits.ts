/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext } from '../utils';
import { makeGetAllLocalKits } from './get-all-local-kits';
import { makeUninstallOneKit } from './uninstall-one-kit';

export const makeUninstallAllKits = (context: APIContext) => {
	const getAllLocalKits = makeGetAllLocalKits(context);
	const uninstallOneKit = makeUninstallOneKit(context);

	return async (): Promise<void> => {
		const kits = await getAllLocalKits();
		const deletePs = kits.map(k => k.globalID).map(id => uninstallOneKit(id));
		await Promise.all(deletePs);
	};
};
