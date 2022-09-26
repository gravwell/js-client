/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledTaskBase } from './scheduled-task-base';

export interface ScheduledScriptData extends ScheduledTaskBase {
	type: 'script';
	script: string;
	isDebugging: boolean;
	debugOutput: string | null;
}
