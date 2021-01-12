/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledScript, ScheduledScript } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';

export const makeCreateManyScheduledScripts = (makerOptions: APIFunctionMakerOptions) => {
	const createOneScheduledScript = makeCreateOneScheduledScript(makerOptions);

	return (authToken: string | null, data: Array<CreatableScheduledScript>): Promise<Array<ScheduledScript>> => {
		const createPromises = data.map(_data => createOneScheduledScript(authToken, _data));
		return Promise.all(createPromises);
	};
};
