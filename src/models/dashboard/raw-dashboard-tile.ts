/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects/id';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export type RawDashboardTile = {
	/** Legacy support: `id` may be undefined. */
	id?: RawNumericID;
	title: string;
	renderer: string;
	hideZoom?: boolean;
	/** Legacy support: `span` may be undefined. */
	span?: {
		col: number;
		row: number;
		/** Legacy support: `x' and 'y` may be undefined. */
		x?: number | undefined;
		y?: number | undefined;
	};
	searchesIndex: number;
	rendererOptions?: DashboardRendererOptions;
};
