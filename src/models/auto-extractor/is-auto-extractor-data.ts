/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { AutoExtractorModule } from './auto-extractor';
import { AutoExtractorData } from './auto-extractor-data';
import { AUTO_EXTRACTOR_MODULES } from './auto-extractor-modules';

export const isAutoExtractorData = (value: unknown): value is AutoExtractorData => {
	try {
		const ae = value as AutoExtractorData;
		return (
			isUUID(ae.id) &&
			isNumericID(ae.userID) &&
			ae.groupIDs.every(isNumericID) &&
			isString(ae.name) &&
			isString(ae.description) &&
			ae.labels.every(isString) &&
			isBoolean(ae.isGlobal) &&
			isDate(ae.lastUpdateDate) &&
			isString(ae.tag) &&
			isAutoExtractorModule(ae.module) &&
			isString(ae.parameters) &&
			(isString(ae.arguments) || isNull(ae.arguments))
		);
	} catch {
		return false;
	}
};

const makeIsAutoExtractorModule = () => {
	const autoExtractorModulesSet = new Set(AUTO_EXTRACTOR_MODULES);

	return (value: unknown): value is AutoExtractorModule => {
		const m = value as AutoExtractorModule;
		return isString(m) && autoExtractorModulesSet.has(m);
	};
};
export const isAutoExtractorModule = makeIsAutoExtractorModule();
