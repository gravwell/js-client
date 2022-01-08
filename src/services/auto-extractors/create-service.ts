/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneAutoExtractor,
	makeDeleteOneAutoExtractor,
	makeDownloadManyAutoExtractors,
	makeGetAllAutoExtractorModules,
	makeGetAllAutoExtractors,
	makeGetAutoExtractorsAuthorizedToMe,
	makeIsValidAutoExtractorSyntax,
	makeUpdateOneAutoExtractor,
	makeUploadManyAutoExtractors,
} from '~/functions/auto-extractors';
import { makeGenerateAutoExtractors } from '~/functions/auto-extractors/generate-auto-extractors';
import { APIContext } from '~/functions/utils';
import { AutoExtractorsService } from './service';

export const createAutoExtractorsService = (context: APIContext): AutoExtractorsService => ({
	get: {
		validModules: makeGetAllAutoExtractorModules(context),
		all: makeGetAllAutoExtractors(context),
		authorizedTo: {
			me: makeGetAutoExtractorsAuthorizedToMe(context),
		},
	},

	guess: {
		many: makeGenerateAutoExtractors(context),
	},

	create: {
		one: makeCreateOneAutoExtractor(context),
	},

	update: {
		one: makeUpdateOneAutoExtractor(context),
	},

	delete: {
		one: makeDeleteOneAutoExtractor(context),
	},

	is: {
		validSyntax: makeIsValidAutoExtractorSyntax(context),
	},

	upload: {
		many: makeUploadManyAutoExtractors(context),
	},

	download: {
		many: makeDownloadManyAutoExtractors(context),
	},
});
