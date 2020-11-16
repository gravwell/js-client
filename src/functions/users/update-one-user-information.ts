/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneUserInformation = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, data: UpdatableUserInformation): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}';
			const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { userID: data.id } });

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableUserInformation(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableUserInformation {
	id: NumericID;
	username?: string;
	name?: string;
	email?: string;
}

interface RawUpdatableUserInformation {
	User?: string;
	Name?: string;
	Email?: string;
}

const toRawUpdatableUserInformation = (updatable: UpdatableUserInformation): RawUpdatableUserInformation =>
	omitUndefinedShallow({
		User: updatable.username,
		Name: updatable.name,
		Email: updatable.email,
	});
