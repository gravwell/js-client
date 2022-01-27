/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID } from '~/value-objects';
import { TemplateVariable } from './template';

export interface RawCreatableTemplate {
	GIDs: Array<RawNumericID>;
	UID?: RawNumericID;
	Name: string;
	Description: string | null;
	Global: boolean;
	Labels: Array<string>;
	Contents: {
		query: string;
		variables: Array<TemplateVariable>;
	};
}
