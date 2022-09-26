/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { RemoteKitData } from './remote-kit-data';

export interface RemoteKit extends RemoteKitData {
	_tag: DATA_TYPE.REMOTE_KIT;
}
