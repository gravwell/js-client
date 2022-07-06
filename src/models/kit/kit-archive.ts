/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { KitArchiveData } from './kit-archive-data';

export interface KitArchive extends KitArchiveData {
	_tag: DATA_TYPE.KIT_ARCHIVE;
}

export interface DeployRules {
	disabled: boolean;
	runImmediately: boolean;
}
