/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '../../value-objects';
import { BaseDashboardSearch } from './dashboard-search';

export type CreatableDashboardSearch = Partial<BaseDashboardSearch> &
	(
		| { type: 'query'; query: string }
		| { type: 'template'; templateID: UUID }
		| { type: 'savedQuery'; savedQueryID: UUID }
		| { type: 'scheduledSearch'; scheduledSearchID: UUID }
	);
