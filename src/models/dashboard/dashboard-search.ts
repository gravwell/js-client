/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { Timeframe } from '../timeframe';

export interface BaseDashboardSearch {
	name: string | null;
	timeframeOverride: Timeframe | null;
	cachedSearchID: NumericID | null;
	variablePreviewValue: string | null;
	color: string | null;
}

export type TypedDashboardSearch =
	| { type: 'query'; query: string }
	| { type: 'template'; templateID: UUID }
	| { type: 'savedQuery'; savedQueryID: UUID }
	| { type: 'scheduledSearch'; scheduledSearchID: UUID };

export type DashboardSearch = BaseDashboardSearch & TypedDashboardSearch;
