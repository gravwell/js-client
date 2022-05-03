/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isMarkdown, isNumericID, isUUID } from '~/value-objects';
import { Playbook } from './playbook';

export const isPlaybook = (value: any): value is Playbook => {
	try {
		const p = <Playbook>value;
		return (
			isUUID(p.id) &&
			isUUID(p.globalID) &&
			isNumericID(p.userID) &&
			p.groupIDs.every(isNumericID) &&
			isString(p.name) &&
			(isString(p.description) || isNull(p.description)) &&
			p.labels.every(isString) &&
			isBoolean(p.isGlobal) &&
			isDate(p.lastUpdateDate) &&
			isMarkdown(p.body) &&
			(isUUID(p.coverImageFileGUID) || isNull(p.coverImageFileGUID)) &&
			(isString(p.author.name) || isNull(p.author.name)) &&
			(isString(p.author.email) || isNull(p.author.email)) &&
			(isString(p.author.company) || isNull(p.author.company)) &&
			(isString(p.author.url) || isNull(p.author.url))
		);
	} catch {
		return false;
	}
};
