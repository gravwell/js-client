/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawRenderModule } from './raw-render-module';
import { RenderModule } from './render-module';

export const toRenderModule = (raw: RawRenderModule): RenderModule => ({
	name: raw.Name,
	description: raw.Description,
	examples: raw.Examples,

	sortingRequired: raw.SortRequired,
});
