/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import {
	Actionable,
	ActionableAction,
	ActionableTrigger,
	RawActionable,
	RawActionableAction,
	RawActionableTrigger,
	toActionable,
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
	parseJSONResponse,
	PartialProps,
} from '../utils';
import { makeGetOneActionable } from './get-one-actionable';

export const makeUpdateOneActionable = (makerOptions: APIFunctionMakerOptions) => {
	const getOneActionable = makeGetOneActionable(makerOptions);

	return async (authToken: string | null, data: UpdatableActionable): Promise<Actionable> => {
		try {
			const current = await getOneActionable(authToken, data.uuid);

			const templatePath = '/api/pivots/{actionableID}';
			const url = buildURL(templatePath, {
				...makerOptions,
				protocol: 'http',
				pathParams: { actionableID: data.uuid },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableActionable(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawActionable>(raw);
			return toActionable(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableActionable {
	uuid: UUID;
	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	menuLabel?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	triggers?: Array<ActionableTrigger>;
	actions?: Array<PartialProps<ConditionalPartial<ActionableAction, null>, 'start' | 'end'>>;
}

interface RawUpdatableActionable {
	// ?Question: why do we allow that field to be set?
	GUID?: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;

	Name: string;
	Description: string | null; // Null becomes empty string
	Contents: {
		menuLabel: string | null;
		actions: Array<RawActionableAction>;
		triggers: Array<RawActionableTrigger>;
	};
}

const toRawUpdatableActionable = (updatable: UpdatableActionable, current: Actionable): RawUpdatableActionable => ({
	UID: toRawNumericID(updatable.userID ?? current.userID),
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

	Global: updatable.isGlobal ?? current.isGlobal,
	Labels: updatable.labels ?? current.labels,

	Name: updatable.name ?? current.name,
	Description: isUndefined(updatable.description) ? current.description : updatable.description,
	Contents: {
		menuLabel: isUndefined(updatable.menuLabel) ? current.menuLabel : updatable.menuLabel,
		actions: (updatable.actions ?? current.actions)
			.map<ActionableAction>(action => ({
				...action,
				description: action.description ?? null,
				placeholder: action.placeholder ?? null,
				start: action.start ?? { type: 'stringFormat', placeholder: null, format: null },
				end: action.end ?? { type: 'stringFormat', placeholder: null, format: null },
			}))
			.map(toRawActionableAction),
		triggers: (updatable.triggers ?? current.triggers).map(toRawActionableTrigger),
	},
});
