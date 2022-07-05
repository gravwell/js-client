/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { Token } from './token';
import { TokenData } from './token-data';

export const fromTokenDataToToken = (data: TokenData): Token => ({
	...data,
	_tag: DATA_TYPE.TOKEN,
});
