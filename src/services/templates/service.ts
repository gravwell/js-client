/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableTemplate, Template, UpdatableTemplate } from '~/models/template';

export interface TemplatesService {
	readonly get: {
		readonly one: (templateID: string) => Promise<Template>;
		readonly all: () => Promise<Array<Template>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Template>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableTemplate) => Promise<Template>;
	};

	readonly update: {
		readonly one: (data: UpdatableTemplate) => Promise<Template>;
	};

	readonly delete: {
		readonly one: (templateID: string) => Promise<void>;
	};
}
