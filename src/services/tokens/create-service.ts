/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneToken } from '~/functions/tokens/create-one-token';
import { makeDeleteOneToken } from '~/functions/tokens/delete-one-token';
import { makeGetAllTokens } from '~/functions/tokens/get-all-tokens';
import { makeGetOneToken } from '~/functions/tokens/get-one-token';
import { makeGetTokensAuthorizedToMe } from '~/functions/tokens/get-tokens-authorized-to-me';
import { makeListTokenCapabilities } from '~/functions/tokens/list-token-capabilities';
import { makeUpdateOneToken } from '~/functions/tokens/update-one-token';
import { APIContext } from '~/functions/utils/api-context';
import { TokensService } from './service';

export const createTokensService = (context: APIContext): TokensService => ({
	get: {
		one: makeGetOneToken(context),
		all: makeGetAllTokens(context),
		authorizedTo: {
			me: makeGetTokensAuthorizedToMe(context),
		},
		tokenCapabilities: makeListTokenCapabilities(context),
	},

	create: {
		one: makeCreateOneToken(context),
	},

	update: {
		one: makeUpdateOneToken(context),
	},

	delete: {
		one: makeDeleteOneToken(context),
	},
});
