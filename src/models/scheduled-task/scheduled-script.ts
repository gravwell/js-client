/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { ScheduledScriptData } from './scheduled-script-data';

export interface ScheduledScript extends ScheduledScriptData {
	_tag: DATA_TYPE.SCHEDULED_SCRIPT;
}