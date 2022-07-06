/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isString } from 'lodash';
import { isScheduledTaskBase } from './is-scheduled-task-base';
import { ScheduledScriptData } from './scheduled-script-data';

export const isScheduledScriptData = (value: unknown): value is ScheduledScriptData => {
	try {
		const ss = <ScheduledScriptData>value;
		return (
			isScheduledTaskBase(ss) &&
			ss.type === 'script' &&
			isString(ss.script) &&
			isBoolean(ss.isDebugging) &&
			(isString(ss.debugOutput) || isNull(ss.debugOutput))
		);
	} catch {
		return false;
	}
};
