/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isString } from 'lodash';
import { isScheduledTaskBase } from './is-scheduled-task-base';
import { ScheduledScript } from './scheduled-script';

export const isScheduledScript = (value: any): value is ScheduledScript => {
	try {
		const ss = <ScheduledScript>value;
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
