/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DashboardRendererOptions } from './dashboard-renderer-options';

export type CreatableDashboardTile = {
	title: string;

	/**
	 * Index for the related search in Dashboard.searches.
	 */
	searchIndex: number;

	renderer: string;
	rendererOptions?: DashboardRendererOptions | null;

	dimensions: {
		columns: number;
		rows: number;
	};

	/** `x` and `y` is only mandatory on creation */
	position: {
		x: number;
		y: number;
	};
};
