/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';
import { TemplateVariable } from './template';

export interface RawTemplate {
	GUID: RawUUID;
	ThingUUID: RawUUID;
	UID: RawNumericID;
	GIDs: null | Array<RawNumericID>;
	Global: boolean;
	Labels: null | Array<string>;
	Name: string;
	Description: string; // Empty string is null
	Updated: string; // Timestamp
	Contents: {
		query: string;
		variables: Array<TemplateVariable>;
	};
}
