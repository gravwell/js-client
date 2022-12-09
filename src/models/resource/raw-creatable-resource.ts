/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects';

export interface RawCreatableResource {
	ResourceName: string;
	Description: string;

	GroupACL: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}
