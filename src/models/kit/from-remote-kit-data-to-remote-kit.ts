/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { RemoteKit } from './remote-kit';
import { RemoteKitData } from './remote-kit-data';

export const fromRemoteKitDataToRemoteKit = (data: RemoteKitData): RemoteKit => ({
	...data,
	_tag: DATA_TYPE.REMOTE_KIT,
});
