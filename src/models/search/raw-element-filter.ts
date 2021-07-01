/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawElementFilterOperation } from './element-filter-operation';

/**
 * Describes a filter used by the Data Explorer. Filters may be included in parse requests
 * or search requests.
 *
 * Most of the fields in this type are derived from IExploreElements from previous data explorer
 * search responses (REQ_EXPLORE_TS_RANGE)
 */
export interface RawElementFilter {
	Tag: string;
	Module: string;
	Path: string;
	Args?: string | undefined;
	Op: RawElementFilterOperation;
	Value: string;
}
