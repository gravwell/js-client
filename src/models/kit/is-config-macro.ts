/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isString } from 'lodash';
import { ConfigMacro } from './config-macro';

export const isConfigMacro = (v: any): v is ConfigMacro =>
	v.type === 'macro value' &&
	isString(v.macroName) &&
	isString(v.description) &&
	isString(v.defaultValue) &&
	(isString(v.value) || (isNull(v.value) && ['tag', 'string'].includes(v.valueType)));
