/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { CreatableFile } from './creatable-file';
import { RawCreatableFile } from './raw-creatable-file';

export const toRawCreatableFile = (data: CreatableFile): RawCreatableFile =>
	omitUndefinedShallow<RawCreatableFile>({
		guid: data.globalID,
		name: data.name,
		desc: data.description ?? '',
		file: data.file,
	});
