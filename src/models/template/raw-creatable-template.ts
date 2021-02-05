/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID } from '~/value-objects';

export interface RawCreatableTemplate {
	Name: string;
	Description: string | null;
	Contents: {
		query: string;
		variable: string;
		variableLabel: string;
		variableDescription: string | null;
		required: boolean;
		testValue: string | null;
	};

	// !WARNING: That's not working right now, CHECK
	UID?: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}
