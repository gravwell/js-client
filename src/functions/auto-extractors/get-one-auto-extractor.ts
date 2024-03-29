/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isUndefined } from 'lodash';
import { AutoExtractor } from '~/models/auto-extractor/auto-extractor';
import { UUID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeGetOneAutoExtractor = (context: APIContext): ((autoExtractorID: UUID) => Promise<AutoExtractor>) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(context);

	return async (autoExtractorID: UUID): Promise<AutoExtractor> => {
		const autoExtractors = await getAllAutoExtractors();
		const autoExtractor = autoExtractors.find(ae => ae.id === autoExtractorID);
		if (isUndefined(autoExtractor)) {
			throw Error('Not found');
		}
		return autoExtractor;
	};
};
