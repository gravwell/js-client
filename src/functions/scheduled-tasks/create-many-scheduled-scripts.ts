/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledScript, ScheduledScript } from '~/models';
import { APIContext } from '../utils';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';

export const makeCreateManyScheduledScripts = (context: APIContext) => {
	const createOneScheduledScript = makeCreateOneScheduledScript(context);

	return (data: Array<CreatableScheduledScript>): Promise<Array<ScheduledScript>> => {
		const createPromises = data.map(_data => createOneScheduledScript(_data));
		return Promise.all(createPromises);
	};
};
