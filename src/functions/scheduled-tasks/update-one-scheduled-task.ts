/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { RawScheduledTask, ScheduledQuery, ScheduledScript, ScheduledTask, toScheduledTask } from '../../models';
import { NumericID, RawNumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeUpdateOneScheduledTask = (makerOptions: APIFunctionMakerOptions) => {
	const getOneScheduledTask = makeGetOneScheduledTask(makerOptions);

	return async <D extends UpdatableScheduledTask>(
		authToken: string | null,
		data: D,
	): Promise<
		D['type'] extends 'query' ? ScheduledQuery : D['type'] extends 'script' ? ScheduledScript : ScheduledTask
	> => {
		const templatePath = '/api/scheduledsearches/{scheduledTaskID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { scheduledTaskID: data.id } });

		try {
			const current = await getOneScheduledTask(authToken, data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableScheduledTask(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawScheduledTask = await parseJSONResponse<RawScheduledTask>(raw);

			const task: ScheduledTask = toScheduledTask(rawScheduledTask);
			return task as any;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface UpdatableScheduledTaskBase {
	id: NumericID;

	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string;
	labels?: Array<string>;

	oneShot?: boolean;
	isDisabled?: boolean;

	schedule?: string;
	timezone?: string | null;
}

export type UpdatableScheduledTask = TaggedUpdatableScheduledQuery | TaggedUpdatableScheduledScript;

export interface UpdatableScheduledQuery extends UpdatableScheduledTaskBase {
	query?: string;
	searchSince?: { lastRun?: boolean; secondsAgo?: number };
}

interface TaggedUpdatableScheduledQuery extends UpdatableScheduledQuery {
	type?: 'query';
}

export interface UpdatableScheduledScript extends UpdatableScheduledTaskBase {
	script?: string;
	isDebugging?: boolean;
}

interface TaggedUpdatableScheduledScript extends UpdatableScheduledScript {
	type?: 'script';
}

interface RawUpdatableScheduledTask {
	Groups: Array<RawNumericID>;

	Name: string;
	Description: string;
	Labels: Array<string>;

	OneShot: boolean;
	Disabled: boolean;

	Timezone: string; //empty string is null
	Schedule: string; // cron job format

	// *START - Standard search properties
	SearchString: string; //empty string is null
	Duration: number; // In seconds, displayed in the GUI as human friendly "Timeframe"
	SearchSinceLastRun: boolean;
	// *END - Standard search properties

	// *START - Script search properties
	Script: string; // empty string is null
	DebugMode: boolean;
	// *END - Script search properties
}

const toRawUpdatableScheduledTask = (
	updatable: UpdatableScheduledTask,
	current: ScheduledTask,
): RawUpdatableScheduledTask => {
	const base = {
		Groups: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

		Name: updatable.name ?? current.name,
		Description: updatable.description ?? current.description,
		Labels: updatable.labels ?? current.labels,

		OneShot: updatable.oneShot ?? current.oneShot,
		Disabled: updatable.isDisabled ?? current.isDisabled,

		Timezone: (isUndefined(updatable.timezone) ? current.timezone : updatable.timezone) ?? '',
		Schedule: updatable.schedule ?? current.schedule,
	};

	const type = updatable.type ?? current.type;
	switch (type) {
		case 'query': {
			const _updatable = <TaggedUpdatableScheduledQuery>updatable;
			const _current = <ScheduledQuery>current;

			return {
				...base,
				SearchString: _updatable.query ?? _current.query,
				Duration: -Math.abs(_updatable.searchSince?.secondsAgo ?? _current.searchSince.secondsAgo),
				SearchSinceLastRun: _updatable.searchSince?.lastRun ?? _current.searchSince.lastRun,

				Script: '',
				DebugMode: false,
			};
		}
		case 'script': {
			const _updatable = <TaggedUpdatableScheduledScript>updatable;
			const _current = <ScheduledScript>current;

			return {
				...base,
				SearchString: '',
				Duration: 0,
				SearchSinceLastRun: false,

				Script: _updatable.script ?? _current.script,
				DebugMode: _updatable.isDebugging ?? _current.isDebugging,
			};
		}
	}
};
