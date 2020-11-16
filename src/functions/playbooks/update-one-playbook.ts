/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { isNull, isUndefined } from 'lodash';
import { Playbook, RawPlaybook, RawPlaybookDecodedMetadata, toPlaybook } from '../../models';
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
import { makeGetOnePlaybook } from './get-one-playbook';

export const makeUpdateOnePlaybook = (makerOptions: APIFunctionMakerOptions) => {
	const getOnePlaybook = makeGetOnePlaybook(makerOptions);

	return async (authToken: string | null, data: UpdatablePlaybook): Promise<Playbook> => {
		try {
			// TODO: We shouldn't have to query the current object before updating
			const current = await getOnePlaybook(authToken, data.uuid);

			const playbookPath = '/api/playbooks/{playbookID}';
			const url = buildURL(playbookPath, {
				...makerOptions,
				protocol: 'http',
				pathParams: { playbookID: data.uuid },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatablePlaybook(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawPlaybook>(raw);
			return toPlaybook(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatablePlaybook {
	uuid: UUID;

	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	body?: Markdown;
	coverImageFileGUID?: UUID | null;
}

interface RawUpdatablePlaybook {
	Name: string;
	Desc: string | null;
	Body: string; // Base64 encoded markdown string
	Metadata: string; // Base64 encoded RawPlaybookDecodedMetadata

	UID: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}

const toRawUpdatablePlaybook = (updatable: UpdatablePlaybook, current: Playbook): RawUpdatablePlaybook => {
	const metadata: RawPlaybookDecodedMetadata = { dashboards: [] };
	if (isUUID(current.coverImageFileGUID))
		metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: current.coverImageFileGUID }];

	if (isNull(updatable.coverImageFileGUID)) metadata.attachments = undefined;
	else if (isUUID(updatable.coverImageFileGUID))
		metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: updatable.coverImageFileGUID }];

	return {
		UID: toRawNumericID(updatable.userID ?? current.userID),
		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

		Global: updatable.isGlobal ?? current.isGlobal,
		Labels: updatable.labels ?? current.labels,

		Name: updatable.name ?? current.name,
		Desc: isUndefined(updatable.description) ? current.description : updatable.description,

		Body: base64Encode(updatable.body ?? current.body),
		Metadata: base64Encode(JSON.stringify(omitUndefinedShallow(metadata))),
	};
};
