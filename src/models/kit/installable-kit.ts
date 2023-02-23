/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '../../value-objects/id';

export interface InstallableKit {
	id: string;
	labels?: Array<string>;

	isGlobal?: boolean;
	installationGroup?: NumericID | undefined;

	overwriteExisting?: boolean;
	allowUnsigned?: boolean;
	allowExternalResource?: boolean;

	settings?: Array<{
		type: 'macro';
		name: string;
		description: string;
		defaultValue: string;
		value: string | null;
		valueType: 'tag' | 'string';
	}>;
}
