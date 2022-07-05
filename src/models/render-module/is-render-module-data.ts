/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { RenderModuleData } from './render-module-data';

export const isRenderModuleData = (value: unknown): value is RenderModuleData => {
	try {
		const m = <RenderModuleData>value;
		return isString(m.name) && isString(m.description) && m.examples.every(isString);
	} catch {
		return false;
	}
};
