/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { RenderModule } from './render-module';
import { RenderModuleData } from './render-module-data';

export const fromRenderModuleDataToRenderModule = (data: RenderModuleData): RenderModule => ({
	...data,
	_tag: DATA_TYPE.RENDER_MODULE,
});