/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isEmpty, isNil } from 'lodash';
import { RawToken, Token } from '~/main';
import { DATA_TYPE } from '~/models';

export const toToken = (raw: RawToken): Token => ({
	_tag: DATA_TYPE.TOKEN,
	id: raw.id,
	userID: raw.uid.toString(),
	name: raw.name,
	description: isEmpty(raw.description) ? null : raw.description,
	capabilities: raw.capabilities,
	createdAt: new Date(raw.createdAt),
	expiresAt:
		isNil(raw.expiresAt) || isEmpty(raw.expiresAt) || raw.expiresAt === '0001-01-01T00:00:00Z'
			? null
			: new Date(raw.expiresAt),
});
