/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractorsFilter, IsValidAutoExtractorSyntaxResponse } from '~/functions/auto-extractors';
import {
	AutoExtractor,
	CreatableAutoExtractor,
	GeneratedAutoExtractors,
	RawAutoExtractorModule,
	UpdatableAutoExtractor,
	UploadableAutoExtractor,
} from '~/models/auto-extractor';
import { GeneratableAutoExtractor } from '~/models/auto-extractor/generatable-auto-extractor';

export interface AutoExtractorsService {
	readonly get: {
		readonly validModules: () => Promise<Array<RawAutoExtractorModule>>;
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
