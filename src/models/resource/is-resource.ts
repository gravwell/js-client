/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isResourceData } from './is-resource-data';
import { Resource } from './resource';

export const isResource = (value: unknown): value is Resource => {
	try {
		const r = <Resource>value;
		return r._tag === DATA_TYPE.RESOURCE && isResourceData(r);
	} catch {
		return false;
	}
};
