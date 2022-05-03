/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { toRawNumericID } from '~/value-objects';
import { CreatableBroadcastNotification } from './creatable-broadcasted-notification';
import { RawCreatableBroadcastedNotification } from './raw-creatable-broadcasted-notification';

export const toRawCreatableBroadcastedNotification = (
	creatable: CreatableBroadcastNotification,
): RawCreatableBroadcastedNotification =>
	omitUndefinedShallow({
		Msg: creatable.message,
		Type: creatable.customID === undefined ? undefined : toRawNumericID(creatable.customID),
		Broadcast: true,

		Sent: creatable.sentDate,
		Expires: creatable.expirationDate,
		IgnoreUntil: creatable.ignoreUntilDate,
	});
