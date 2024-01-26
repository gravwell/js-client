/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isDate, isNil, isNull, isNumber, isString } from 'lodash';
import { isVersion } from '~/models/version/is-version';
import { isNumericID, isUUID } from '~/value-objects/id';
import { configMacroDecoder } from './is-config-macro';
import { KitArchiveData } from './kit-archive-data';

export const isKitArchiveData = (v: unknown): v is KitArchiveData => {
	try {
		const k = v as KitArchiveData;
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
			(isNil(k.flows) || k.flows.every(isNumber)) &&
			(isNil(k.alerts) || k.alerts.every(isUUID)) &&
			(isNil(k.configMacros) || k.configMacros.every(macro => configMacroDecoder.guard(macro)))
		);
	} catch (e) {
		console.error(e);
		return false;
	}
};
