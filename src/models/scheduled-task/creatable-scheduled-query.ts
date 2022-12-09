/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledTaskBase } from './creatable-scheduled-task-base';

export interface CreatableScheduledQuery extends CreatableScheduledTaskBase {
	query: string;
	searchSince: { lastRun: true; secondsAgo?: number } | { lastRun?: false; secondsAgo: number };
}
