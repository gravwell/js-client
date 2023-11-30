/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetAllRenderModules } from '~/functions/render-modules/get-all-render-modules';
import { APIContext } from '~/functions/utils/api-context';
import { RenderModulesService } from './service';

export const createRenderModulesService = (context: APIContext): RenderModulesService => ({
	get: {
		all: makeGetAllRenderModules(context),
	},
});
