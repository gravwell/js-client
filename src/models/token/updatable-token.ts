/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TokenCapability } from '~/main';
import { ID } from '~/value-objects';

/**
 * Updatable token fields, in a friendly format.
 *
 * NOTE: It's ok to update the capabilitites of an existing token because if you have access to update a token, you also have access to create a new one with whatever capabilities you want.
 */
export interface UpdatableToken {
	id: ID;

	/**
	 * The name of the created token
	 *
	 * @example
	 * "My token"
	 */
	name?: string;

	/**
	 * Optional token description.
	 *
	 * @example
	 * "My new description"
	 */
	description?: string | null;

	capabilities?: Array<TokenCapability>;

	/**
	 * Optional date indicating that the token should automatically expire.
	 *
	 * Setting this to `null` means it won't expire.
	 */
	expiresAt?: Date | null;
}
