/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID, UUID } from '~/value-objects';
import { Timeframe } from '../timeframe';
import { RawDashboardSearch } from './raw-dashboard-search';

export interface BaseDashboardSearch {
	name: string | null;
	timeframeOverride: Timeframe | null;
	cachedSearchID: NumericID | null;
	variablePreviewValue: string | null;
	color: string | null;
}

export type QueryDashboardSearch = { type: 'query'; query: string };
export type TemplateDashboardSearch = { type: 'template'; templateID: UUID };
export type SavedQueryDashboardSearch = { type: 'savedQuery'; savedQueryID: UUID };
export type ScheduledQueryDashboardSearch = { type: 'scheduledSearch'; scheduledSearchID: UUID };

// A catchall for legacy dashboard searches. Similar to how non-js-client/dashboard store
// code handled in 5.1.4 and prior.
// E.G. it was permissable for legacy dashboard search to be of the form
//     `{ "alias": "New Proc 4d And Hash", "searchID": 2228740613 }`
// GUI would render an `empty search` error message.
export type LegacyDashboardSearch = RawDashboardSearch & { type: 'legacy' };

export type TypedDashboardSearch =
	| LegacyDashboardSearch
	| QueryDashboardSearch
	| TemplateDashboardSearch
	| SavedQueryDashboardSearch
	| ScheduledQueryDashboardSearch;

export type DashboardSearch = BaseDashboardSearch & TypedDashboardSearch;
