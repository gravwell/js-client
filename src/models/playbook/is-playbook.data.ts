/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isMarkdown, isNumericID, isUUID } from '~/value-objects';
import { PlaybookData } from './playbook-data';

export const isPlaybookData = (value: unknown): value is PlaybookData => {
	try {
		const p = <PlaybookData>value;
		return (
			isUUID(p.id) &&
			isUUID(p.globalID) &&
			isNumericID(p.userID) &&
			p.groupIDs.every(isNumericID) &&
			(isString(p.name) || isNull(p.name)) &&
			(isString(p.description) || isNull(p.description)) &&
			p.labels.every(isString) &&
			isBoolean(p.isGlobal) &&
			isDate(p.lastUpdateDate) &&
			isMarkdown(p.body) &&
			(isUUID(p.coverImageFileGlobalID) || isNull(p.coverImageFileGlobalID)) &&
			(isUUID(p.bannerImageFileGlobalID) || isNull(p.bannerImageFileGlobalID)) &&
			(isString(p.author.name) || isNull(p.author.name)) &&
			(isString(p.author.email) || isNull(p.author.email)) &&
			(isString(p.author.company) || isNull(p.author.company)) &&
			(isString(p.author.url) || isNull(p.author.url))
		);
	} catch {
		return false;
	}
};
