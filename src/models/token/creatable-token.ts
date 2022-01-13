/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TokenCapability } from './token-capability';

/**
 * Minimum data required to create a token, in a friendly format.
 */
export interface CreatableToken {
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
	description?: string | null;

	capabilities: Array<TokenCapability>;

	/**
	 * Optional date indicating that the token should automatically expire.
	 *
	 * Setting this to `null` (or `undefined`) means it won't expire.
	 */
	expiresAt?: Date | null;
}
