/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isNumber, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { FileMetadataData } from './file-metadata-data';

export const isFileMetadataData = (value: unknown): value is FileMetadataData => {
	try {
		const f = <FileMetadataData>value;
		return (
			isUUID(f.id) &&
			isUUID(f.globalID) &&
			isNumericID(f.userID) &&
			f.groupIDs.every(isNumericID) &&
			isBoolean(f.isGlobal) &&
			isString(f.name) &&
			(isString(f.description) || isNull(f.description)) &&
			f.labels.every(isString) &&
			isDate(f.lastUpdateDate) &&
			isString(f.downloadURL) &&
			isNumber(f.size) &&
			isString(f.contentType)
		);
	} catch {
		return false;
	}
};
