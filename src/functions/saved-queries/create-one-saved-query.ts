/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { RawSavedQuery, RawTimeframe, SavedQuery, Timeframe, toRawTimeframe, toSavedQuery } from '../../models';
import { NumericID, RawNumericID, RawUUID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeCreateOneSavedQuery = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/library';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableSavedQuery): Promise<SavedQuery> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableSavedQuery(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawSavedQuery>(raw);
			return toSavedQuery(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableSavedQuery {
	globalID?: UUID;

	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

	name: string;
	description?: string | null;
	labels?: Array<string>;

	query: string;
	defaultTimeframe?: Timeframe | null;
}

interface RawCreatableSavedQuery {
	GUID?: RawUUID;

	GIDs: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Description: string; // Empty is null
	Labels: Array<string>;

	Query: string;
	Metadata: { timeframe: RawTimeframe | null };
}

export const toRawCreatableSavedQuery = (data: CreatableSavedQuery): RawCreatableSavedQuery =>
	omitUndefinedShallow<RawCreatableSavedQuery>({
		GUID: data.globalID,

		GIDs: (data.groupIDs ?? []).map(toRawNumericID),
		Global: data.isGlobal ?? false,

		Name: data.name,
		Description: data.description ?? '',
		Labels: data.labels ?? [],

		Query: data.query,
		Metadata: { timeframe: isNil(data.defaultTimeframe) ? null : toRawTimeframe(data.defaultTimeframe) },
	});
