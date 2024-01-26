/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects/id';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export interface DashboardTile {
	/** Legacy support: `id` may be undefined. */
	id?: NumericID;

	title: string;

	hideZoom: boolean;

	searchIndex: number; // -1 indicates that even if a tile existing with the given DashboardTile#id, when updated the tile search will be replaced.

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
