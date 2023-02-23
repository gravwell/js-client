/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '../../value-objects/id';

export interface RawInstallableKit {
	Labels?: Array<string>;

	Global: boolean;

	InstallationGroup: RawNumericID;

	OverwriteExisting: boolean;

	AllowUnsigned: boolean;
	AllowExternalResource: boolean;

	ConfigMacros: Array<{
		DefaultValue: string;
		Description: string;
		MacroName: string;
		Value: string | null;
		InstalledByID: string;
		Type: 'TAG' | 'STRING';
	}>;
}
