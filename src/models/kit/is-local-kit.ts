/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isLocalKitData } from './is-local-kit-data';
import { LocalKit } from './local-kit';

export const isLocalKit = (v: any): v is LocalKit => {
	try {
		const k = <LocalKit>v;
		return k._tag === DATA_TYPE.LOCAL_KIT && isLocalKitData(k);
	} catch {
		return false;
	}
};
