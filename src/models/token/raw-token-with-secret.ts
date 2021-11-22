/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawToken } from './raw-token';

/**
 * Token containing the secret (only available when the token is created)
 */
export interface RawTokenWithSecret extends RawToken {
	/**
	 * The created token
	 *
	 * @example
	 * "sdlkjslasdlkfjiowej132452389sdkljsd"
	 */
	token: string;
}
