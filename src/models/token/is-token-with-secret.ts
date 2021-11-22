/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { isToken } from './is-token';
import { TokenWithSecret } from './token-with-secret';

export const isTokenWithSecret = (value: unknown): value is TokenWithSecret => {
	try {
		const t = <TokenWithSecret>value;
		return isToken(t) && isString(t.token);
	} catch {
		return false;
	}
};
