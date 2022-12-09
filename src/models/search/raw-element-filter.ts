/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isString } from 'lodash';
import { isRawElementFilterOperation, RawElementFilterOperation } from './element-filter-operation';

/** Filter to perform an operation on a field. */
export interface RawOperationFilter {
	Tag: string;
	Module: string;
	Path: string;
	Args?: string | undefined;
	Op: RawElementFilterOperation;
	Value: string;
}

export const isRawOperationFilter = (v: RawElementFilter): v is RawOperationFilter => {
	try {
		const ef = v as RawOperationFilter;
		return isRawElementFilterOperation(ef.Op) && isString(ef.Value);
	} catch {
		return false;
	}
};

/** Filter to extract a field. */
export interface RawExtractionFilter {
	Tag?: string | undefined;
	Module: string;
	Path: string;
	Args?: string | undefined;
}

/**
 * Describes a filter used by the Data Explorer. Filters may be included in
 * parse requests or search requests.
 *
 * Most of the fields in this type are derived from IExploreElements from
 * previous data explorer search responses (REQ_EXPLORE_TS_RANGE)
 */
export type RawElementFilter = RawOperationFilter | RawExtractionFilter;
