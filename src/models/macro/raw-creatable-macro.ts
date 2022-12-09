/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects';

export interface RawCreatableMacro {
	GIDs: Array<RawNumericID>;
	Global: boolean;
	Name: string;
	Description: string | null;
	Expansion: string;
	Labels: Array<string>;
}
