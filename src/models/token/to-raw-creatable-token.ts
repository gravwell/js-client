/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawCreatableToken } from '~/main';
import { CreatableToken } from './creatable-token';

export const toRawCreatableToken = (creatable: CreatableToken): RawCreatableToken => ({
	name: creatable.name,
	description: creatable.description ?? null,
	capabilities: creatable.capabilities,
	expiresAt: creatable.expiresAt?.toISOString() ?? null,
});
