/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID } from '~/value-objects';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export type RawDashboardTile = {
	/** Legacy support: `id` may be undefined. */
	id?: RawNumericID;
	title: string;
	renderer: string;
	span: { col: number; row: number; x?: number; y?: number };
	searchesIndex: number;
	rendererOptions?: DashboardRendererOptions;
};
