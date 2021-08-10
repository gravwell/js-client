/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export interface DashboardTile {
	id: NumericID;
	title: string;

	/**
	 * Index for the related search in Dashboard.searches.
	 */
	searchIndex: number;

	renderer: string;
	rendererOptions: DashboardRendererOptions;

	dimensions: {
		columns: number;
		rows: number;
	};
	position: {
		x: number;
		y: number;
	};
}
