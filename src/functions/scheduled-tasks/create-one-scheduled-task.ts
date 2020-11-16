/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery, ScheduledScript, ScheduledTask } from '../../models';
import { NumericID, RawNumericID, toNumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeCreateOneScheduledTask = (makerOptions: APIFunctionMakerOptions) => {
	const getOneScheduledTask = makeGetOneScheduledTask(makerOptions);

	const templatePath = '/api/scheduledsearches';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async <D extends CreatableScheduledTask>(
		authToken: string | null,
		data: D,
	): Promise<
		D['type'] extends 'query' ? ScheduledQuery : D['type'] extends 'script' ? ScheduledScript : ScheduledTask
	> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableScheduledTask(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<RawNumericID>(raw);
			const scheduledTaskID = toNumericID(rawID);

			const task: ScheduledTask = await getOneScheduledTask(authToken, scheduledTaskID);
			return task as any;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface CreatableScheduledTaskBase {
	groupIDs?: Array<NumericID>;

	name: string;
	description: string;
	labels?: Array<string>;

	oneShot?: boolean;
	isDisabled?: boolean;

	schedule: string;
	timezone?: string | null;
}

export type CreatableScheduledTask = TaggedCreatableScheduledQuery | TaggedCreatableScheduledScript;

export interface CreatableScheduledQuery extends CreatableScheduledTaskBase {
	query: string;
	searchSince: { lastRun: true; secondsAgo?: number } | { lastRun?: false; secondsAgo: number };
}

interface TaggedCreatableScheduledQuery extends CreatableScheduledQuery {
	type: 'query';
}

export interface CreatableScheduledScript extends CreatableScheduledTaskBase {
	script: string;
	isDebugging?: boolean;
}

interface TaggedCreatableScheduledScript extends CreatableScheduledScript {
	type: 'script';
}

interface RawCreatableScheduledTask {
	Groups: Array<RawNumericID>;

	Name: string;
	Description: string;
	Labels: Array<string>;

	OneShot: boolean;
	Disabled: boolean;

	Schedule: string; // cron job format
	Timezone: string; // empty string is null

	// *START - Standard search properties
	SearchString?: string; //empty string is null
	Duration?: number; // In seconds, displayed in the GUI as a human friendly "Timeframe"
	SearchSinceLastRun?: boolean;
	// *END - Standard search properties

	// *START - Script search properties
	Script?: string; // empty string is null
	DebugMode: boolean;
	// *END - Script search properties
}

export const toRawCreatableScheduledTask = (data: CreatableScheduledTask): RawCreatableScheduledTask => {
	const base = {
		Groups: (data.groupIDs ?? []).map(toRawNumericID),

		Name: data.name,
		Description: data.description,
		Labels: data.labels ?? [],

		OneShot: data.oneShot ?? false,
		Disabled: data.isDisabled ?? false,

		Schedule: data.schedule,
		Timezone: data.timezone ?? '',
	};

	switch (data.type) {
		case 'query':
			return {
				...base,
				SearchString: data.query,
				Duration: -Math.abs(data.searchSince.secondsAgo ?? 0),
				SearchSinceLastRun: data.searchSince.lastRun ?? false,
				DebugMode: false,
			};
		case 'script':
			return {
				...base,
				Script: data.script,
				DebugMode: data.isDebugging ?? false,
			};
	}
};
