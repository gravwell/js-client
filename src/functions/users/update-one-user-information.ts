/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { omitUndefinedShallow } from '../utils/omit-undefined-shallow';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeUpdateOneUserInformation =
	(context: APIContext) =>
	async (data: UpdatableUserInformation): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID: data.id } });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableUserInformation(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

export interface UpdatableUserInformation {
	id: NumericID;
	username?: string;
	name?: string;
	email?: string;
	role?: 'admin' | 'analyst';
}

interface RawUpdatableUserInformation {
	User?: string;
	Name?: string;
	Email?: string;
	Admin?: boolean;
}

const toRawUpdatableUserInformation = (updatable: UpdatableUserInformation): RawUpdatableUserInformation =>
	omitUndefinedShallow({
		User: updatable.username,
		Name: updatable.name,
		Email: updatable.email,
		Admin: updatable.role === 'admin',
	});
