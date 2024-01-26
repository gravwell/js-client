/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableToken } from '~/models/token/creatable-token';
import { Token } from '~/models/token/token';
import { TokenCapability } from '~/models/token/token-capability';
import { TokenWithSecret } from '~/models/token/token-with-secret';
import { UpdatableToken } from '~/models/token/updatable-token';
import { ID } from '~/value-objects/id';

export interface TokensService {
	readonly get: {
		readonly one: (tokenID: ID) => Promise<Token>;
		readonly all: () => Promise<Array<Token>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Token>>;
		};
		readonly tokenCapabilities: () => Promise<Array<TokenCapability>>;
	};

	readonly create: {
		readonly one: (data: CreatableToken) => Promise<TokenWithSecret>;
	};

	readonly update: {
		readonly one: (data: UpdatableToken) => Promise<Token>;
	};

	readonly delete: {
		readonly one: (tokenID: ID) => Promise<void>;
	};
}
