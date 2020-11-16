/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, RawNumericID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeCreateOneTemplate = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/templates';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableTemplate): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableTemplate(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<UUID>(raw);
			return rawRes;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableTemplate {
	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name: string;
	description?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;
	isRequired: boolean;

	query: string;
	variable: {
		token: string;
		name: string;
		description?: string | null;
	};

	previewValue?: string | null;
}

interface RawCreatableTemplate {
	Name: string;
	Description: string | null;
	Contents: {
		query: string;
		variable: string;
		variableLabel: string;
		variableDescription: string | null;
		required: boolean;
		testValue: string | null;
	};

	// !WARNING: That's not working right now, CHECK
	UID?: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}

const toRawCreatableTemplate = (creatable: CreatableTemplate): RawCreatableTemplate =>
	omitUndefinedShallow({
		UID: creatable.userID ? toRawNumericID(creatable.userID) : undefined,
		GIDs: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

		Global: creatable.isGlobal ?? false,
		Labels: creatable.labels ?? [],

		Name: creatable.name,
		Description: creatable.description ?? null,
		Contents: {
			required: creatable.isRequired,
			query: creatable.query,
			variable: creatable.variable.token,
			variableDescription: creatable.variable.description ?? null,
			variableLabel: creatable.variable.name,
			testValue: creatable.previewValue ?? null,
		},
	});
