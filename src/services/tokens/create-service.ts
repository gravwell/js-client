/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneToken,
	makeDeleteOneToken,
	makeGetAllTokens,
	makeGetOneToken,
	makeGetTokensAuthorizedToMe,
	makeListTokenCapabilities,
	makeUpdateOneToken,
} from '~/functions/tokens';
import { APIContext } from '~/functions/utils';
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
