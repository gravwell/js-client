/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { TokenCapability } from './token-capability';

export const isTokenCapability = (value: unknown): value is TokenCapability =>
	isString(value) && value in TokenCapability;
