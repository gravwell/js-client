/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '~/value-objects';
import { TokenCapability } from './token-capability';

/**
 * Information about an existing token, in a friendly format.
 *
 * WARNING: The token secret is not included. The token secret is only shown when it is created.
 */
export interface TokenData {
	id: ID;

	/**
	 * The id of the token's owner
	 */
	userID: ID;

	/** The name of the created token */
	name: string;

	/**
	 * An optional description of the created token.
	 *
	 * @example
	 * "My resource read / write token"
	 */
	description: string | null;

	capabilities: Array<TokenCapability>;

	/**
	 * When this token was created
	 */
	createdAt: Date;

	/**
	 * Optional date indicating that the token should automatically expire.
	 *
	 * `null` means it won't expire.
	 */
	expiresAt: Date | null;
}
