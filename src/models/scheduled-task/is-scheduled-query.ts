/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	array,
	boolean,
	constant,
	either,
	instanceOf,
	null_,
	number,
	object,
	string,
	Verifier,
} from '~/functions/utils/verifiers';
import { DATA_TYPE } from '../data-type';
import { ScheduledQuery } from './scheduled-query';

export const scheduledQueryDecoder: Verifier<ScheduledQuery> = object({
	_tag: constant(DATA_TYPE.SCHEDULED_QUERY),

	type: constant('query'),
	query: string,
	searchSince: object({
		lastRun: boolean,
		secondsAgo: number,
	}),

	id: string,
	globalID: string,

	userID: string,
	groupIDs: array(string),
	isGlobal: boolean,

	name: string,
	description: string,
	labels: array(string),

	oneShot: boolean,
	isDisabled: boolean,

	lastUpdateDate: instanceOf(Date),
	lastRun: either(
		null_,
		object({
			date: instanceOf(Date),
			duration: number,
		}),
	),

	lastSearchIDs: either(null_, array(string)),
	lastError: either(null_, string),

	schedule: string,
	timezone: either(null_, string),
});
