/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects/id';
import { AutoExtractorData } from './auto-extractor-data';

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
			isString(ae.module) &&
			isString(ae.parameters) &&
			(isString(ae.arguments) || isNull(ae.arguments))
		);
	} catch {
		return false;
	}
};
