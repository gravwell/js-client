/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { constant, either, null_, object, string, Verifier } from '~/functions/utils/verifiers';
import { ConfigMacro } from './config-macro';

export const configMacroDecoder: Verifier<ConfigMacro> = object({
	macroName: string,
	description: string,
	defaultValue: string,
	value: either(string, null_),
	type: either(constant('tag'), constant('string')),
});
