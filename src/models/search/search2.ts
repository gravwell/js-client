/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '../../value-objects';

export interface Search2 {
	id: NumericID;
	userID: NumericID;
	groupID?: NumericID;
	states: Array<'active' | 'dormant' | 'backgrounded' | 'saved' | 'attached' | 'saving'>;
	attachedClients: number;
	storedData: number;
}

export type Search2State = Search2['states'][number];
