/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '../../value-objects';
import { UserRole } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeCreateOneUser = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/users';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableUser): Promise<NumericID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableUser(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<number>(raw);
			return rawRes.toString();
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableUser {
	user: string;
	password: string;
	name: string;
	email: string;
	role: UserRole;
}

interface RawCreatableUser {
	User: string;
	Pass: string;
	Name: string;
	Email: string;
	Admin: boolean;
}

const toRawCreatableUser = (creatable: CreatableUser): RawCreatableUser =>
	omitUndefinedShallow({
		User: creatable.user,
		Pass: creatable.password,
		Name: creatable.name,
		Email: creatable.email,
		Admin: creatable.role === 'admin',
	});
