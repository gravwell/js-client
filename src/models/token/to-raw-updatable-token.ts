/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { RawUpdatableToken } from '~/main';
import { Token } from './token';
import { UpdatableToken } from './updatable-token';

export const toRawUpdatableToken = (updatable: UpdatableToken, current: Token): RawUpdatableToken => {
	return {
		id: updatable.id,
		name: updatable.name ?? current.name,
		description: isUndefined(updatable.description) ? current.description : updatable.description,
		capabilities: updatable.capabilities ?? current.capabilities,
		expiresAt: (isUndefined(updatable.expiresAt) ? current.expiresAt : updatable.expiresAt)?.toISOString() ?? null,
	};
};
