/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString, isUndefined } from 'lodash';
import { isUUID } from '~/value-objects';
import { isReplicatedState, ReplicatedState } from './replicated-state';
import { isWell, Well } from './well';

/** An indexer's well. */
export interface IndexerWell {
	name: string;
	uuid: string;
	wells: Array<Well>;
	replicated?: Record<string, Array<ReplicatedState>>;
}

export const isIndexerWell = (value: unknown): value is IndexerWell => {
	try {
		const i = <IndexerWell>value;

		return (
			isUUID(i.uuid) &&
			isString(i.name) &&
			i.wells.every(isWell) &&
			(isUndefined(i.replicated) ||
				Object.entries(i.replicated).every(([k, v]) => isString(k) && v.every(isReplicatedState)))
		);
	} catch {
		return false;
	}
};
