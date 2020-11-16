/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIFunctionMakerOptions } from '../utils';
import { makeGetAllLocalKits } from './get-all-local-kits';
import { makeUninstallOneKit } from './uninstall-one-kit';

export const makeUninstallAllKits = (makerOptions: APIFunctionMakerOptions) => {
	const getAllLocalKits = makeGetAllLocalKits(makerOptions);
	const uninstallOneKit = makeUninstallOneKit(makerOptions);

	return async (authToken: string | null): Promise<void> => {
		const kits = await getAllLocalKits(authToken);
		const deletePs = kits.map(k => k.globalID).map(id => uninstallOneKit(authToken, id));
		await Promise.all(deletePs);
	};
};
