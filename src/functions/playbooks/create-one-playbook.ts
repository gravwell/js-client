/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { RawPlaybookDecodedMetadata } from '../../models';
import { isUUID, Markdown, NumericID, RawNumericID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeCreateOnePlaybook = (makerOptions: APIFunctionMakerOptions) => {
	const playbookPath = '/api/playbooks';
	const url = buildURL(playbookPath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatablePlaybook): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatablePlaybook(data)),
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

export interface CreatablePlaybook {
	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name: string;
	description?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	body: Markdown;
	coverImageFileGUID?: UUID | null;
}

interface RawCreatablePlaybook {
	Name: string;
	Desc: string | null;
	Body: string; // Base64 encoded markdown string
	Metadata: string; // Base64 encoded RawPlaybookDecodedMetadata

	// !WARNING: That's not working right now, CHECK
	UID?: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}

const toRawCreatablePlaybook = (creatable: CreatablePlaybook): RawCreatablePlaybook => {
	const metadata: RawPlaybookDecodedMetadata = { dashboards: [] };
	if (isUUID(creatable.coverImageFileGUID))
		metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: creatable.coverImageFileGUID }];

	return omitUndefinedShallow({
		UID: creatable.userID ? toRawNumericID(creatable.userID) : undefined,
		GIDs: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

		Global: creatable.isGlobal ?? false,
		Labels: creatable.labels ?? [],

		Name: creatable.name,
		Desc: creatable.description ?? null,

		Body: base64Encode(creatable.body),
		Metadata: base64Encode(JSON.stringify(metadata)),
	});
};
