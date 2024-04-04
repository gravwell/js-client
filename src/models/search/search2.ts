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
	oneOf,
	string,
	Verifier,
} from '~/functions/utils/verifiers';
import { DATA_TYPE } from '../data-type';
import { PersistentSearchData } from './persistent-search-data';

export interface Search2 extends PersistentSearchData {
	_tag: DATA_TYPE.PERSISTENT_SEARCH;
}

export const search2Verifier: Verifier<Search2> = object({
	_tag: constant(DATA_TYPE.PERSISTENT_SEARCH),
	id: string,
	userID: string,
	groupID: either(string, null_),
	states: array(
		oneOf<'active' | 'dormant' | 'backgrounded' | 'saved' | 'attached' | 'saving'>([
			'active',
			'dormant',
			'backgrounded',
			'saved',
			'attached',
			'saving',
		]),
	),
	attachedClients: number,
	storedData: number,

	userQuery: string,
	effectiveQuery: string,
	noHistory: boolean,
	import: object({
		imported: boolean,
		time: instanceOf(Date),
		batchName: string,
		batchInfo: string,
	}),
	started: instanceOf(Date),
});
