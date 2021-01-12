/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawSearch2 {
	ID: string;
	UID: number;
	GID: number; // zero is undefined
	State: string; // RawSearch2State or RawSearch2State/RawSearch2State eg. 'ACTIVE' or 'SAVED/BACKGROUNDED'
	AttachedClients: number;
	StoredData: number;
}

export type RawSearch2State = 'ACTIVE' | 'DORMANT' | 'SAVED' | 'BACKGROUNDED' | 'ATTACHED' | 'SAVING';
