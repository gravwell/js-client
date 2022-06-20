/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { AutoExtractor, AutoExtractorModule } from './auto-extractor';

export const isAutoExtractor = (value: unknown): value is AutoExtractor => {
	try {
		const ae = <AutoExtractor>value;
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
	const extractorsModules = ['csv', 'fields', 'regex', 'slice', 'json'] as const;

	return (value: unknown): value is AutoExtractorModule => {
		const m = <AutoExtractorModule>value;

		return isString(m) && extractorsModules.includes(m);
	};
};
export const isAutoExtractorModule = makeIsAutoExtractorModule();
