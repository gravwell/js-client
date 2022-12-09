/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ConfigMacro } from './config-macro';
import { RawConfigMacro } from './raw-config-macro';

export const toConfigMacro = (macro: RawConfigMacro): ConfigMacro => ({
	macroName: macro.MacroName,
	description: macro.Description,
	defaultValue: macro.DefaultValue,
	value: macro.Value ?? null,
	type: macro.Type === 'TAG' ? 'tag' : 'string',
});

export const toConfigMacros = (macros: Array<RawConfigMacro>): Array<ConfigMacro> => macros.map(toConfigMacro);
