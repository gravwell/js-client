/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import * as FormData from 'form-data';
import { LocalKit, RawLocalKit, RemoteKit, toLocalKit } from '~/models';
import { isRemoteKit } from '../../models/kit/is-remote-kit';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	File,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeStageOneRemoteKit =
	(context: APIContext) =>
	async (kit: File | RemoteKit): Promise<LocalKit> => {
		const resourcePath = '/api/kits';
		const url = buildURL(resourcePath, { ...context, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: toFormData(kit) as any,
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawLocalKit>(raw);

			return toLocalKit(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

const toFormData = (file: File | RemoteKit): FormData => {
	const formData = new FormData();
	if (isRemoteKit(file)) {
		formData.append('remote', file.globalID);
	} else {
		formData.append('file', file);
	}
	return formData;
};
