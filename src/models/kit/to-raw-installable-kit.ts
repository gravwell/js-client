/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { toRawNumericID } from '../../value-objects/id';
import { InstallableKit } from './installable-kit';
import { RawInstallableKit } from './raw-installable-kit';

export const toRawInstallableKit = (data: InstallableKit): RawInstallableKit =>
	omitUndefinedShallow({
		Labels: (data.labels?.length ?? 0) > 0 ? data.labels : undefined,
		Global: data.isGlobal ?? false,
		OverwriteExisting: data.overwriteExisting ?? false,
		AllowUnsigned: data.allowUnsigned ?? false,
		AllowExternalResource: data.allowExternalResource ?? false,
		InstallationGroup: data.installationGroup ? toRawNumericID(data.installationGroup) : undefined,
		ConfigMacros: (data.settings ?? []).map(s => ({
			DefaultValue: s.defaultValue,
			Description: s.description,
			MacroName: s.name,
			Value: s.value,
			InstalledByID: data.id,
			Type: s.valueType === 'tag' ? 'TAG' : 'STRING',
		})),
	});
