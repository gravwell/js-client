/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIFunctionMakerOptions } from '../utils';
import { makeDeleteOneScheduledScript } from './delete-one-scheduled-script';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';

export const makeDeleteAllScheduledScripts = (makerOptions: APIFunctionMakerOptions) => {
	const deleteOneScheduledScript = makeDeleteOneScheduledScript(makerOptions);
	const getAllScheduledScripts = makeGetAllScheduledScripts(makerOptions);

	return async (authToken: string | null): Promise<void> => {
		const scripts = await getAllScheduledScripts(authToken);
		const deletePs = scripts.map(s => deleteOneScheduledScript(authToken, s.id));
		await Promise.all(deletePs);
	};
};
