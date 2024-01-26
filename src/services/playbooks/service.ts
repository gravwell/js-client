/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatablePlaybook } from '~/models/playbook/creatable-playbook';
import { Playbook } from '~/models/playbook/playbook';
import { UpdatablePlaybook } from '~/models/playbook/updatable-playbook';

export interface PlaybooksService {
	readonly get: {
		readonly one: (playbookID: string) => Promise<Playbook>;
		readonly all: () => Promise<Array<Omit<Playbook, 'body'>>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Omit<Playbook, 'body'>>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatablePlaybook) => Promise<Playbook>;
	};

	readonly update: {
		readonly one: (data: UpdatablePlaybook) => Promise<Playbook>;
	};

	readonly delete: {
		readonly one: (playbookID: string) => Promise<void>;
	};
}
