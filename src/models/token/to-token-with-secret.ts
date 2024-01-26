/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawTokenWithSecret } from '~/models/token/raw-token-with-secret';
import { TokenWithSecret } from '~/models/token/token-with-secret';
import { toToken } from './to-token';

export const toTokenWithSecret = (raw: RawTokenWithSecret): TokenWithSecret => ({
	...toToken(raw),
	token: raw.token,
});
