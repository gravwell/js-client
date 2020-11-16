/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isUndefined } from 'lodash';
import {
	CreatableTimeframe,
	RawSavedQuery,
	RawTimeframe,
	SavedQuery,
	toRawTimeframe,
	toSavedQuery,
} from '../../models';
import { NumericID, RawNumericID, RawUUID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneSavedQuery } from './get-one-saved-query';

export const makeUpdateOneSavedQuery = (makerOptions: APIFunctionMakerOptions) => {
	const getOneSavedQuery = makeGetOneSavedQuery(makerOptions);

	return async (authToken: string | null, data: UpdatableSavedQuery): Promise<SavedQuery> => {
		const templatePath = '/api/library/{savedQueryID}?admin=true';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { savedQueryID: data.id } });

		try {
			const current = await getOneSavedQuery(authToken, data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableSavedQuery(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawSavedQuery = await parseJSONResponse<RawSavedQuery>(raw);
			return toSavedQuery(rawSavedQuery);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableSavedQuery {
	id: UUID;
	globalID?: UUID;

	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	query?: string;
	defaultTimeframe?: CreatableTimeframe | null;
}

interface RawUpdatableSavedQuery {
	ThingUUID: RawUUID; // gravwell/gravwell#2524
	GUID?: RawUUID;

	GIDs: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Description: string; // Empty is null
	Labels: Array<string>;

	Query: string;
	Metadata: { timeframe: RawTimeframe | null };
}

const toRawUpdatableSavedQuery = (updatable: UpdatableSavedQuery, current: SavedQuery): RawUpdatableSavedQuery => {
	const defaultTimeframe = isUndefined(updatable.defaultTimeframe)
		? current.defaultTimeframe
		: updatable.defaultTimeframe;
	const rawTimeframe = isNull(defaultTimeframe) ? null : toRawTimeframe(defaultTimeframe);

	return {
		ThingUUID: current.id,
		GUID: updatable.globalID ?? current.globalID,

		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
		Global: updatable.isGlobal ?? current.isGlobal,

		Name: updatable.name ?? current.name,
		Description: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
		Labels: updatable.labels ?? current.labels,

		Query: updatable.query ?? current.query,
		Metadata: { timeframe: rawTimeframe },
	};
};
