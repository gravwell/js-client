/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { array, boolean, constant, either, null_, object, string, Verifier } from '~/functions/utils/verifiers';
import { DATA_TYPE } from '~/models/data-type';
import { timeframeVerifier } from '~/models/timeframe/is-timeframe';
import { SavedQuery } from './saved-query';

export const savedQueryVerifier: Verifier<SavedQuery> = object({
	_tag: constant(DATA_TYPE.SAVED_QUERY),
	id: string,
	globalID: string,
	userID: string,

	can: object({
		delete: boolean,
		modify: boolean,
		share: boolean,
	}),

	access: object({
		read: object({
			global: boolean,
			groups: array(string),
		}),
		write: object({
			global: boolean,
			groups: array(string),
		}),
	}),

	name: string,
	description: either(string, null_),
	labels: array(string),

	query: string,
	defaultTimeframe: either(timeframeVerifier, null_),
});

export const isSavedQuery = (value: unknown): value is SavedQuery => savedQueryVerifier.guard(value);
