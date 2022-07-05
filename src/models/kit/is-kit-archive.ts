/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isKitArchiveData } from './is-kit-archive-data';
import { KitArchive } from './kit-archive';

export const isKitArchive = (v: unknown): v is KitArchive => {
	try {
		const k = <KitArchive>v;
		return k._tag === DATA_TYPE.KIT_ARCHIVE && isKitArchiveData(k);
	} catch (e) {
		console.error(e);
		return false;
	}
};
