/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledScript } from '~/models/scheduled-task/creatable-scheduled-scripts';
import { ScheduledScript } from '~/models/scheduled-task/scheduled-script';
import { APIContext } from '../utils/api-context';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';

export const makeCreateManyScheduledScripts = (
	context: APIContext,
): ((data: Array<CreatableScheduledScript>) => Promise<Array<ScheduledScript>>) => {
	const createOneScheduledScript = makeCreateOneScheduledScript(context);

	return (data: Array<CreatableScheduledScript>): Promise<Array<ScheduledScript>> => {
		const createPromises = data.map(_data => createOneScheduledScript(_data));
		return Promise.all(createPromises);
	};
};
