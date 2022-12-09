/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { constant, Decoder, either, null_, object, string } from 'decoders';
import { mkTypeGuard } from '../../functions/utils/type-guards';
import { ConfigMacro } from './config-macro';

const configMacroDecoder: Decoder<ConfigMacro> = object({
	macroName: string,
	description: string,
	defaultValue: string,
	value: either(string, null_),
	type: either(constant('tag'), constant('string')),
});

export const isConfigMacro: (v: unknown) => v is ConfigMacro = mkTypeGuard(configMacroDecoder);
