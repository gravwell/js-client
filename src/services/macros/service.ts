/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { MacrosFilter } from '~/functions/macros';
import { CreatableMacro, Macro, UpdatableMacro } from '~/models/macro';

export interface MacrosService {
	readonly get: {
		readonly one: (macroID: string) => Promise<Macro>;
		readonly many: (filter?: MacrosFilter) => Promise<Array<Macro>>;
		readonly all: () => Promise<Array<Macro>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Macro>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableMacro) => Promise<Macro>;
	};

	readonly update: {
		readonly one: (data: UpdatableMacro) => Promise<Macro>;
	};

	readonly delete: {
		readonly one: (macroID: string) => Promise<void>;
	};
}
