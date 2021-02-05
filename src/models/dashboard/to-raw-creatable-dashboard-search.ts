/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { isNumericID, toRawNumericID } from '../../value-objects';
import { toRawTimeframe } from '../timeframe';
import { CreatableDashboardSearch } from './creatable-dashboard-search';
import { RawCreatableDashboardSearch } from './raw-creatable-dashboard';

export const toRawCreatableDashboardSearch = (data: CreatableDashboardSearch): RawCreatableDashboardSearch =>
	omitUndefinedShallow({
		alias: data.name ?? null,
		timeframe: data.timeframeOverride ? toRawTimeframe(data.timeframeOverride) : undefined,
		query: data.type === 'query' ? data.query : undefined,
		searchID: isNumericID(data.cachedSearchID) ? toRawNumericID(data.cachedSearchID) : undefined,
		reference: ((): RawCreatableDashboardSearch['reference'] => {
			if (data.type === 'query') return undefined;

			const extras = { defaultValue: data.variablePreviewValue ?? null };
			switch (data.type) {
				case 'template':
					return { id: data.templateID, type: 'template', extras };
				case 'savedQuery':
					return { id: data.savedQueryID, type: 'savedQuery', extras };
				case 'scheduledSearch':
					return { id: data.scheduledSearchID, type: 'scheduledSearch', extras };
			}
		})(),
	});
