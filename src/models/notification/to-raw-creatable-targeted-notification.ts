/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '~/functions/utils';
import { toRawNumericID } from '~/value-objects';
import { CreatableTargetedNotification } from './creatable-targeted-notification';
import {
	RawCreatableBaseTargetedNotification,
	RawCreatableGroupTargetedNotification,
	RawCreatableMyselfTargetedNotification,
	RawCreatableTargetedNotification,
	RawCreatableUserTargetedNotification,
} from './raw-creatable-targeted-notification';

export const toRawCreatableTargetedNotification = (
	creatable: CreatableTargetedNotification,
): RawCreatableTargetedNotification => {
	const base: RawCreatableBaseTargetedNotification = omitUndefinedShallow({
		Msg: creatable.message,
		Type: creatable.customID === undefined ? undefined : toRawNumericID(creatable.customID),
		Broadcast: false,

		Sent: creatable.sentDate,
		Expires: creatable.expirationDate,
		IgnoreUntil: creatable.ignoreUntilDate,
	});

	switch (creatable.targetType) {
		case 'myself':
			return omitUndefinedShallow<RawCreatableMyselfTargetedNotification>({ ...base, GID: 0, UID: 0 });
		case 'group':
			return omitUndefinedShallow<RawCreatableGroupTargetedNotification>({
				...base,
				UID: 0,
				GID: toRawNumericID(creatable.groupID),
			});
		case 'user':
			return omitUndefinedShallow<RawCreatableUserTargetedNotification>({
				...base,
				GID: 0,
				UID: toRawNumericID(creatable.userID),
			});
	}
};
