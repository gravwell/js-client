/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';
import { TokenCapability } from './token-capability';

/**
 * Information about an existing token.
 *
 * WARNING: The token secret is not included. The token secret is only shown when it is created.
 */
export interface RawToken {
	id: RawUUID;

	/**
	 * The id of the token's owner
	 */
	uid: RawNumericID;

	/** The name of the created token */
	name: string;

	/**
	 * An optional description of the created token. Might return null or an empty string.
	 *
	 * @example
	 * "My resource read / write token"
	 */
	description: string | null;

	capabilities: Array<TokenCapability>;

	/**
	 * The date / time this token was created
	 *
	 * @example
	 * "2032-04-23T18:25:43.511Z"
	 */
	createdAt: string;

	/**
	 * Optional DateTime in RFC3339 indicating that the token should automatically expire.
	 *
	 * WARNING: If this property is not included (or is included and set to `"0001-01-01T00:00:00Z"`), that means it won't expire
	 *
	 * @example
	 * "2022-12-31T12:00:00Z"
	 */
	expiresAt: string | null | undefined;
}
