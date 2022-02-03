/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawUser {
	UID: number;
	User: string;
	Name: string;
	Email: string;
	Admin: boolean;
	Locked: boolean;
	TS: string;

	Synced: boolean;
	DefaultGID?: number | undefined;
	Groups: Array<{
		GID: number;
		Name: string;
		Desc: string;
		Synced: boolean;
	}>;
}
