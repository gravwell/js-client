/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawInstallableKit {
	Labels: Array<string>;
	Global: boolean;
	OverwriteExisting: boolean;
	AllowUnsigned: boolean;
	AllowExternalResource: boolean;
	ConfigMacros: Array<{
		DefaultValue: string;
		Description: string;
		MacroName: string;
		Value: string | null;
		Type: 'TAG' | 'STRING';
	}>;
}
