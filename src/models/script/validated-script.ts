/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type ValidatedScript = { isValid: true; error: null } | { isValid: false; error: ScriptError };

export interface ScriptError {
	message: string;
	line: number | null;
	column: number | null;
}
