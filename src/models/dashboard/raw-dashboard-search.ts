/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawTimeframe } from '../timeframe';

export type RawDashboardSearch = {
	alias: string | null;
	timeframe?: RawTimeframe | null | undefined;
	query?: string | null | undefined;
	searchID?: RawNumericID | null | undefined;
	color?: string | null | undefined;
	reference?:
		| {
				id: RawUUID;
				type: 'template' | 'savedQuery' | 'scheduledSearch';
				extras?:
					| {
							defaultValue?: string | null | undefined;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};
