/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { InstallableKit } from './installable-kit';
import { RawInstallableKit } from './raw-installable-kit';

export const toRawInstallableKit = (data: InstallableKit): RawInstallableKit => ({
	Labels: data.labels ?? [],
	Global: data.isGlobal ?? false,
	OverwriteExisting: data.overwriteExisting ?? false,
	AllowUnsigned: data.allowUnsigned ?? false,
	AllowExternalResource: data.allowExternalResource ?? false,
	ConfigMacros: (data.settings ?? []).map(s => ({
		DefaultValue: s.defaultValue,
		Description: s.description,
		MacroName: s.name,
		Value: s.value,
		Type: s.valueType === 'tag' ? 'TAG' : 'STRING',
	})),
});
