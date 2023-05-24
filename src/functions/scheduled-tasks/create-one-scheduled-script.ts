/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledScript, ScheduledScript } from '~/models';
import { APIContext } from '../utils';
import { makeCreateOneScheduledTask } from './create-one-scheduled-task';

export const makeCreateOneScheduledScript = (
	context: APIContext,
): ((data: CreatableScheduledScript) => Promise<ScheduledScript>) => {
	const createOneScheduledTask = makeCreateOneScheduledTask(context);

	return (data: CreatableScheduledScript): Promise<ScheduledScript> =>
		createOneScheduledTask({ ...data, type: 'script' });
};
