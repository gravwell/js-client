/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	ActionableAction,
	ActionableTrigger,
	RawActionableAction,
	RawActionableTrigger,
	toRawActionableAction,
	toRawActionableTrigger,
} from '../../models';
import { NumericID, RawNumericID, RawUUID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	ConditionalPartial,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
	PartialProps,
} from '../utils';

export const makeCreateOneActionable = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/pivots';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableActionable): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableActionable(data)),
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

export interface CreatableActionable {
	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name: string;
	description?: string | null;
	menuLabel?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	triggers: Array<ActionableTrigger>;
	actions: Array<PartialProps<ConditionalPartial<ActionableAction, null>, 'start' | 'end'>>;
}

interface RawCreatableActionable {
	// ?Question: Why do we allow that field to be set? gravwell/gravwell#2318 nº 3
	GUID?: RawUUID;

	// !WARNING: That's not working right now, but there's an open issue for that gravwell/gravwell#2318 nº 5
	UID?: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;

	Name: string;
	Description: string | null;
	Contents: {
		menuLabel: string | null;
		actions: Array<RawActionableAction>;
		triggers: Array<RawActionableTrigger>;
	};
}

const toRawCreatableActionable = (creatable: CreatableActionable): RawCreatableActionable =>
	omitUndefinedShallow({
		UID: creatable.userID ? toRawNumericID(creatable.userID) : undefined,
		GIDs: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

		Global: creatable.isGlobal ?? false,
		Labels: creatable.labels ?? [],

		Name: creatable.name,
		Description: creatable.description ?? null,
		Contents: {
			menuLabel: creatable.menuLabel ?? null,
			actions: creatable.actions
				.map<ActionableAction>(action => ({
					...action,
					description: action.description ?? null,
					placeholder: action.placeholder ?? null,
					start: action.start ?? { type: 'stringFormat', placeholder: null, format: null },
					end: action.end ?? { type: 'stringFormat', placeholder: null, format: null },
				}))
				.map(toRawActionableAction),
			triggers: creatable.triggers.map(toRawActionableTrigger),
		},
	});
