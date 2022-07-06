/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isRenderModuleData } from './is-render-module-data';
import { RenderModule } from './render-module';

export const isRenderModule = (value: unknown): value is RenderModule => {
	try {
		const m = <RenderModule>value;
		return m._tag === DATA_TYPE.RENDER_MODULE && isRenderModuleData(m);
	} catch {
		return false;
	}
};
