/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { RawTemplate, Template, toTemplate } from '../../models';
import { NumericID, RawNumericID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneTemplate } from './get-one-template';

export const makeUpdateOneTemplate = (makerOptions: APIFunctionMakerOptions) => {
	const getOneTemplate = makeGetOneTemplate(makerOptions);

	return async (authToken: string | null, data: UpdatableTemplate): Promise<Template> => {
		try {
			const current = await getOneTemplate(authToken, data.uuid);

			const templatePath = '/api/templates/{templateID}';
			const url = buildURL(templatePath, {
				...makerOptions,
				protocol: 'http',
				pathParams: { templateID: data.uuid },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableTemplate(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawTemplate>(raw);
			return toTemplate(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableTemplate {
	uuid: UUID;

	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;
	isRequired?: boolean;

	query?: string;
	variable?: {
		token?: string;
		name?: string;
		description?: string | null;
	};

	previewValue?: string | null;
}

interface RawUpdatableTemplate {
	UID: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;

	Name: string;
	Description: string | null; // Null becomes empty string
	Contents: {
		query: string;
		variable: string;
		variableLabel: string;
		variableDescription: string | null;
		required: boolean;
		testValue: string | null;
	};
}

const toRawUpdatableTemplate = (updatable: UpdatableTemplate, current: Template): RawUpdatableTemplate => {
	const updatableVariableDescription = updatable.variable?.description;

	return {
		UID: toRawNumericID(updatable.userID ?? current.userID),
		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

		Global: updatable.isGlobal ?? current.isGlobal,
		Labels: updatable.labels ?? current.labels,

		Name: updatable.name ?? current.name,
		Description: isUndefined(updatable.description) ? current.description : updatable.description,
		Contents: {
			required: updatable.isRequired ?? current.isRequired,
			query: updatable.query ?? current.query,
			variable: updatable.variable?.token ?? current.variable.token,
			variableLabel: updatable.variable?.name ?? current.variable.name,
			variableDescription: isUndefined(updatableVariableDescription)
				? current.variable.description
				: updatableVariableDescription,
			testValue: isUndefined(updatable.previewValue) ? current.previewValue : updatable.previewValue,
		},
	};
};
