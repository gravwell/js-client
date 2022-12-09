/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID, UUID } from '~/value-objects';
import { TemplateVariable } from './template';

export interface UpdatableTemplate {
	id: UUID;
	userID?: NumericID;
	groupIDs?: Array<NumericID>;
	name?: string;
	description?: string | null;
	labels?: Array<string>;
	isGlobal?: boolean;
	query?: string;
	variables?: Array<TemplateVariable>;
}
