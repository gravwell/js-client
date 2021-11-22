/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TokenCapability } from '~/main';
import { RawUUID } from '~/value-objects';

/**
 * Updatable token fields.
 *
 * NOTE: It's ok to update the capabilitites of an existing token because if you have access to update a token, you also have access to create a new one with whatever capabilities you want.
 */
export interface RawUpdatableToken {
	id: RawUUID;

	/**
	 * The name of the created token
	 *
	 * @example
	 * "My token"
	 */
	name: string;

	/**
	 * Optional token description. May be null or an empty string.
	 *
	 * @example
	 * "My new description"
	 */
	description: string | null;

	capabilities: Array<TokenCapability>;

	/**
	 * Optional DateTime in RFC3339 indicating that the token should automatically expire.
	 *
	 * WARNING: If this property is not included (or is included and set to `"0001-01-01T00:00:00Z"`), that means it won't expire
	 */
	expiresAt: string | null;
}
