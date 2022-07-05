/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isTokenData } from './is-token-data';
import { Token } from './token';

export const isToken = (value: unknown): value is Token => {
	try {
		const t = <Token>value;
		return t._tag === DATA_TYPE.TOKEN && isTokenData(t);
	} catch {
		return false;
	}
};
