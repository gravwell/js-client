/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { LocalKit } from './local-kit';
import { LocalKitData } from './local-kit-data';

export const fromLocalKitDataToLocalKit = (data: LocalKitData): LocalKit => ({
	...data,
	_tag: DATA_TYPE.LOCAL_KIT,
});
