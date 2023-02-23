/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DashboardRendererOptions } from './dashboard-renderer-options';

export type UpdatableDashboardTile = {
	/** We have a ID if is a existing, or undefined if is a new tile */
	id?: string;

	title: string;

	hideZoom: boolean;

	/** Index for the related search in Dashboard.searches. */
	searchIndex: number;

	renderer: string;
	rendererOptions?: DashboardRendererOptions | null;

	dimensions: {
		columns: number;
		rows: number;
	};

	position: {
		x: number;
		y: number;
	};
};
