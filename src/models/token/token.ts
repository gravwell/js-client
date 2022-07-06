/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { TokenData } from './token-data';

/**
 * Information about an existing token, in a friendly format.
 *
 * WARNING: The token secret is not included. The token secret is only shown when it is created.
 */
export interface Token extends TokenData {
	_tag: DATA_TYPE.TOKEN;
}
