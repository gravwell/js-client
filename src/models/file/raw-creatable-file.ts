/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { File } from '~/functions/utils';
import { RawUUID } from '../../value-objects';

export interface RawCreatableFile {
	/**
	 * Optional global ID for this file. If not set, one will be generated.
	 */
	guid?: RawUUID;

	/**
	 * Body of the file.
	 */
	file: File;

	/**
	 * Name of the file.
	 */
	name: string;

	/**
	 * Description of the file.
	 */
	desc: string;
}
