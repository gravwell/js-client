/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneAutoExtractor } from '~/functions/auto-extractors/create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from '~/functions/auto-extractors/delete-one-auto-extractor';
import { makeDownloadManyAutoExtractors } from '~/functions/auto-extractors/download-many-auto-extractors';
import { makeGenerateAutoExtractors } from '~/functions/auto-extractors/generate-auto-extractors';
import { makeGetAllAutoExtractorModules } from '~/functions/auto-extractors/get-all-auto-extractor-modules';
import { makeGetAllAutoExtractors } from '~/functions/auto-extractors/get-all-auto-extractors';
import { makeGetAutoExtractorsAuthorizedToMe } from '~/functions/auto-extractors/get-auto-extractors-authorized-to-me';
import { makeIsValidAutoExtractorSyntax } from '~/functions/auto-extractors/is-valid-auto-extractor-syntax';
import { makeUpdateOneAutoExtractor } from '~/functions/auto-extractors/update-one-auto-extractor';
import { makeUploadManyAutoExtractors } from '~/functions/auto-extractors/upload-many-auto-extractors';
import { APIContext } from '~/functions/utils/api-context';
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
