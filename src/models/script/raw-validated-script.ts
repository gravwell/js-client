/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawValidatedScript {
	OK: boolean;
	Error?: string;
	ErrorLine: number; // -1 is null
	ErrorColumn: number; // -1 is null
}
