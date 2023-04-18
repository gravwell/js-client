/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isString } from 'lodash';
import { ElementFilterOperation, isElementFilterOperation } from './element-filter-operation';

/** Filter to perform an operation on a field. */
export interface OperationFilter {
	tag: string | null;
	module: string;
	path: string;
	arguments: string | null;
	operation: ElementFilterOperation;
	value: string;
}

export const isOperationFilter = (v: ElementFilter): v is OperationFilter => {
	try {
		const ef = v as OperationFilter;
		return isElementFilterOperation(ef.operation) && isString(ef.value);
	} catch {
		return false;
	}
};

/** Filter to extract a field. */
export interface ExtractionFilter {
	tag: string | null;
	module: string;
	path: string;
	arguments: string | null;
}

export type ElementFilter = OperationFilter | ExtractionFilter;
