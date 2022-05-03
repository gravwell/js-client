import { IndexerWell } from '../../models/indexer/indexer-well';
/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface IndexersService {
	readonly restart: () => Promise<void>;

	readonly get: {
		readonly all: () => Promise<Array<IndexerWell>>;
	};
}
