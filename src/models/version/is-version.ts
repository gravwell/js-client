/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isInteger } from 'lodash';
import { Version } from './version';

export const isVersion = (value: unknown): value is Version => {
	try {
		const v = value as Version;
		return isInteger(v.major) && isInteger(v.minor) && isInteger(v.patch);
	} catch {
		return false;
	}
};

/** Verify if the Version on left is great than the Version on right */
export const isVersionGreatThan = (version_1: Version, version_2: Version): boolean => {
	// If is great than base
	if (version_1.major > version_2.major) {
		return true;
	}
	// If the major are equals, verify the minor
	if (version_1.major === version_2.major) {
		if (version_1.minor > version_2.minor) {
			return true;
		}

		// If the minor are equals, verify the patch
		if (version_1.minor === version_2.minor) {
			if (version_1.patch > version_2.patch) {
				return true;
			}
		}
	}

	return false;
};
