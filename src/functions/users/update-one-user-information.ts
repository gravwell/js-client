/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneUserInformation = (context: APIContext) => {
	return async (data: UpdatableUserInformation): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID: data.id } });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableUserInformation(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
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
