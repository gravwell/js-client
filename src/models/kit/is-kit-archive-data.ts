/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/
/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isDate, isNil, isNull, isNumber, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { isVersion } from '../version';
import { isConfigMacro } from './is-config-macro';
import { KitArchiveData } from './kit-archive-data';

export const isKitArchiveData = (v: unknown): v is KitArchiveData => {
	try {
		const k = <KitArchiveData>v;
		return (
			isString(k.id) &&
			isNumericID(k.userID) &&
			(isNull(k.buildDate) || isDate(k.buildDate)) &&
			isString(k.name) &&
			isString(k.description) &&
			isNumber(k.version) &&
			(isNull(k.minVersion) || isVersion(k.minVersion)) &&
			(isNull(k.maxVersion) || isVersion(k.maxVersion)) &&
			isString(k.readme) &&
			(isNil(k.icon) || isUUID(k.icon)) &&
			(isNil(k.cover) || isUUID(k.cover)) &&
			(isNil(k.banner) || isUUID(k.banner)) &&
			(isNil(k.actionables) || k.actionables.every(isUUID)) &&
			(isNil(k.dashboards) || k.dashboards.every(isNumber)) &&
			(isNil(k.extractors) || k.extractors.every(isUUID)) &&
			(isNil(k.files) || k.files.every(isUUID)) &&
			(isNil(k.macros) || k.macros.every(isNumber)) &&
			(isNil(k.playbooks) || k.playbooks.every(isUUID)) &&
			(isNil(k.savedQueries) || k.savedQueries.every(isUUID)) &&
			(isNil(k.resources) || k.resources.every(isUUID)) &&
			(isNil(k.scheduledSearches) || k.scheduledSearches.every(isUUID)) &&
			(isNil(k.templates) || k.templates.every(isUUID)) &&
			(isNil(k.configMacros) || k.configMacros.every(isConfigMacro))
		);
	} catch (e) {
		console.error(e);
		return false;
	}
};
