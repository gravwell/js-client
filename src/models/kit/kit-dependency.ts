/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ID, isID } from '~/value-objects';
import { isVersion, Version } from '../version';

export type KitDependency = {
	id: ID;
	compatibility: {
		min: Version;
	};
};

export const isKitDependency = (v: any): v is KitDependency => {
	try {
		const dep = v as KitDependency;
		return isID(dep.id) && isVersion(dep.compatibility.min);
	} catch {
		return false;
	}
};
