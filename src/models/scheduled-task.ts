/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isNumber, isString } from 'lodash';
import { isNumericID, isUUID, NumericID, RawNumericID, RawUUID, toNumericID, UUID } from '../value-objects';

export interface RawScheduledTask {
	ID: RawNumericID;
	GUID: RawUUID;

	Owner: RawNumericID;
	Groups: Array<RawNumericID> | null;

	Name: string;
	Description: string;
	Labels: Array<string> | null;

	/**
	 * Boolean which, if set to true, will cause the scheduled search to run once
	 * as soon as possible, unless disabled.
	 */
	OneShot: boolean;
	/**
	 * Boolean which, if set to true, will prevent the scheduled search from
	 * running.
	 */
	Disabled: boolean;

	Updated: string; // Timestamp

	/**
	 * Any error resulting from the last run of this search.
	 */
	LastError: string; // empty string is null
	/**
	 * Time at which this scheduled search last ran.
	 */
	LastRun: string; // Timestamp
	/**
	 * How long the last run took.
	 */
	LastRunDuration: number;
	/**
	 * Search IDs of the most recently performed searches from this scheduled
	 * search.
	 */
	LastSearchIDs: null;

	Timezone: string; //empty string is null

	/**
	 * Cron-compatible string specifying when to run.
	 */
	Schedule: string; // cron job format

	// *START - Standard search properties
	/**
	 * Gravwell query to execute.
	 */
	SearchString: string; //empty string is null
	/**
	 * Value in seconds specifying how far back to run the search. This must be a
	 * negative value.
	 */
	Duration: number; // In seconds, displayed in the GUI as human friendly "Timeframe"
	/**
	 * Boolean which, if set to true, will ignore the Duration field and the
	 * search will instead run from the LastRun time to the present.
	 */
	SearchSinceLastRun: boolean;
	// *END - Standard search properties

	// *START - Script search properties
	/**
	 * String containing an anko script.
	 */
	Script: string; // empty string is null
	DebugMode: boolean;
	/**
	 * Base64 string of debug output.
	 */
	DebugOutput: null;
	// *END - Script search properties

	/**
	 * 64-bit integer used to store permission bits.
	 *
	 * ?QUESTION: Is that still in use? How would it be used?
	 */
	Permissions: 0;

	/**
	 * ?QUESTION: What is this? Couldn't find it being used in the GUI and the
	 * docs don't mention what it does.
	 */
	PersistentMaps: {};
}

interface ScheduledTaskBase {
	id: NumericID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string;
	labels: Array<string>;

	oneShot: boolean;
	isDisabled: boolean;

	lastUpdateDate: Date;
	lastRunDate: Date;

	lastSearchIDs: null;
	lastRunDuration: number;
	lastError: string | null;

	schedule: string;
	timezone: string | null;
}

export type ScheduledTask = ScheduledQuery | ScheduledScript;
export type ScheduledTaskType = ScheduledTask['type'];

export interface ScheduledQuery extends ScheduledTaskBase {
	type: 'query';
	query: string;
	searchSince: { lastRun: boolean; secondsAgo: number };
}

export interface ScheduledScript extends ScheduledTaskBase {
	type: 'script';
	script: string;
	isDebugging: boolean;
	debugOutput: string | null;
}

const toScheduledTaskBase = (raw: RawScheduledTask): ScheduledTaskBase => ({
	id: toNumericID(raw.ID),
	globalID: raw.GUID,

	userID: toNumericID(raw.Owner),
	groupIDs: raw.Groups?.map(toNumericID) ?? [],

	name: raw.Name,
	description: raw.Description,
	labels: raw.Labels ?? [],

	oneShot: raw.OneShot,
	isDisabled: raw.Disabled,

	lastUpdateDate: new Date(raw.Updated),
	lastRunDate: new Date(raw.LastRun),

	lastSearchIDs: raw.LastSearchIDs,
	lastRunDuration: raw.LastRunDuration,
	lastError: raw.LastError.trim() === '' ? null : raw.LastError,

	schedule: raw.Schedule,
	timezone: raw.Timezone.trim() === '' ? null : raw.Timezone,
});

export const toScheduledTask = (raw: RawScheduledTask): ScheduledTask => {
	const base = toScheduledTaskBase(raw);
	// From the [docs](https://docs.gravwell.io/#!api/scheduledsearches.md#Creating_a_scheduled_search):
	// If both (Script and SearchString) are populated, the script will take precedence.
	const type: ScheduledTaskType = raw.Script.trim().length > 0 ? 'script' : 'query';

	switch (type) {
		case 'query':
			return {
				...base,
				type: 'query',
				query: raw.SearchString,
				searchSince: {
					lastRun: raw.SearchSinceLastRun,
					secondsAgo: Math.abs(raw.Duration),
				},
			};
		case 'script':
			return {
				...base,
				type: 'script',
				script: raw.Script,
				isDebugging: raw.DebugMode,
				debugOutput: raw.DebugOutput,
			};
	}
};

export const isScheduledTaskBase = (value: any): value is ScheduledTaskBase => {
	try {
		const ss = <ScheduledTaskBase>value;
		return (
			isNumericID(ss.id) &&
			isUUID(ss.globalID) &&
			isNumericID(ss.userID) &&
			ss.groupIDs.every(isNumericID) &&
			isString(ss.name) &&
			isString(ss.description) &&
			ss.labels.every(isString) &&
			isBoolean(ss.oneShot) &&
			isBoolean(ss.isDisabled) &&
			isDate(ss.lastUpdateDate) &&
			isDate(ss.lastRunDate) &&
			isNull(ss.lastSearchIDs) &&
			isNumber(ss.lastRunDuration) &&
			(isString(ss.lastError) || isNull(ss.lastError)) &&
			isString(ss.schedule) &&
			(isString(ss.timezone) || isNull(ss.timezone))
		);
	} catch {
		return false;
	}
};

export const isScheduledQuery = (value: any): value is ScheduledQuery => {
	try {
		const sq = <ScheduledQuery>value;
		return (
			isScheduledTaskBase(sq) &&
			sq.type === 'query' &&
			isString(sq.query) &&
			(isNumber(sq.searchSince.secondsAgo) || isBoolean(sq.searchSince.lastRun))
		);
	} catch {
		return false;
	}
};

export const isScheduledScript = (value: any): value is ScheduledScript => {
	try {
		const ss = <ScheduledScript>value;
		return (
			isScheduledTaskBase(ss) &&
			ss.type === 'script' &&
			isString(ss.script) &&
			isBoolean(ss.isDebugging) &&
			(isString(ss.debugOutput) || isNull(ss.debugOutput))
		);
	} catch {
		return false;
	}
};
