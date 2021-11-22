/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TokenCapability } from './token-capability';

/**
 * Minimum data required to create a token
 */
export interface RawCreatableToken {
	/**
	 * A name for the token
	 *
	 * @example
	 * "My token"
	 */
	name: string;

	/**
	 * An optional description for the token
	 *
	 * @example
	 * "My resource read / resource write token"
	 */
	description: string | null;

	capabilities: Array<TokenCapability>;

	/**
	 * Optional DateTime in RFC3339 indicating that the token should automatically expire.
	 *
	 * WARNING: If this property is not included (or is included and set to `"0001-01-01T00:00:00Z"`), that means it won't expire
	 *
	 * @example
	 * "2022-12-31T12:00:00Z"
	 */
	expiresAt: string | null;
}
