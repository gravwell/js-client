/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ConfigMacro } from './config-macro';
import { RawConfigMacro } from './raw-config-macro';

export const toRawConfigMacro = (macro: ConfigMacro): RawConfigMacro => ({
	DefaultValue: macro.defaultValue,
	Description: macro.description,
	MacroName: macro.macroName,
	Value: macro.value,
	Type: macro.type === 'tag' ? 'TAG' : 'STRING',
});
