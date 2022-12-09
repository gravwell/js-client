/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ConditionalPartial, PartialProps } from '~/functions/utils';
import { NumericID } from '~/value-objects';
import { ActionableAction, ActionableTrigger } from './actionable';

export interface CreatableActionable {
	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name: string;
	description?: string | null;
	menuLabel?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	triggers: Array<ActionableTrigger>;
	actions: Array<PartialProps<ConditionalPartial<ActionableAction, null>, 'start' | 'end'>>;
}
