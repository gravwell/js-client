/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { AutoExtractorsFilter } from '~/functions/auto-extractors/download-many-auto-extractors';
import { IsValidAutoExtractorSyntaxResponse } from '~/functions/auto-extractors/is-valid-auto-extractor-syntax';
import { AutoExtractor } from '~/models/auto-extractor/auto-extractor';
import { CreatableAutoExtractor } from '~/models/auto-extractor/creatable-auto-extractor';
import { GeneratableAutoExtractor } from '~/models/auto-extractor/generatable-auto-extractor';
import { GeneratedAutoExtractors } from '~/models/auto-extractor/generated-auto-extractors';
import { UpdatableAutoExtractor } from '~/models/auto-extractor/updatable-auto-extractor';
import { UploadableAutoExtractor } from '~/models/auto-extractor/uploadable-auto-extractor';

export interface AutoExtractorsService {
	readonly get: {
		readonly validModules: () => Promise<Array<string>>;
		readonly all: () => Promise<Array<AutoExtractor>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<AutoExtractor>>;
		};
	};

	readonly guess: {
		readonly many: (data: GeneratableAutoExtractor) => Promise<GeneratedAutoExtractors>;
	};

	readonly create: {
		readonly one: (data: CreatableAutoExtractor) => Promise<AutoExtractor>;
	};

	readonly update: {
		readonly one: (data: UpdatableAutoExtractor) => Promise<AutoExtractor>;
	};

	readonly delete: {
		readonly one: (autoExtractorID: string) => Promise<void>;
	};

	readonly is: {
		readonly validSyntax: (data: CreatableAutoExtractor) => Promise<IsValidAutoExtractorSyntaxResponse>;
	};

	readonly upload: {
		readonly many: (data: UploadableAutoExtractor) => Promise<Array<AutoExtractor>>;
	};

	readonly download: {
		readonly many: (filter: AutoExtractorsFilter) => Promise<string>;
	};
}
