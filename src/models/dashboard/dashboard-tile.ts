/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export interface DashboardTile {
	/** Legacy support: `id` may be undefined. */
	id?: NumericID;
	title: string;

	/**
	 * Index for the related search in Dashboard.searches.
	 * `string` included for legacy dashboard support.
	 */
	searchIndex: number | string;

	renderer: string;

	/**	Due to the old dashboards we may not have `.rendererOptions` defined */
	rendererOptions: DashboardRendererOptions | null;

	dimensions: {
		columns: number;
		rows: number;
	};

	/**	Due to the old dashboards we may not have `x` and `y` defined */
	position: {
		x: number | null;
		y: number | null;
	};
}
