/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { isNumericID, NumericID, RawNumericID, toRawNumericID } from '~/value-objects/id';
import { Notification } from './notification';
import { RawUpdatableNotification } from './raw-updatable-notification';
import { UpdatableNotification } from './updatable-notification';

export const toRawUpdatableNotification = (
	updatable: UpdatableNotification,
	current: Notification,
): RawUpdatableNotification =>
	omitUndefinedShallow({
		Msg: updatable.message ?? current.message,
		Type: getType(current.customID, updatable.customID),
		UID: toRawNumericID(current.userID),
		GID: 0,
		Broadcast: current.type === 'broadcasted',

		Sent: updatable.sentDate ?? current.sentDate,
		Expires: updatable.expirationDate ?? current.expirationDate,
		IgnoreUntil: updatable.ignoreUntilDate ?? current.ignoreUntilDate,
		Level: undefined,
		Link: undefined,
	});

const getType = (currentType: NumericID | null, updatableType?: NumericID | null): RawNumericID => {
	if (isNumericID(updatableType)) {
		return toRawNumericID(updatableType);
	}
	if (isNull(updatableType) || isNull(currentType)) {
		return 0;
	}
	return toRawNumericID(currentType);
};
