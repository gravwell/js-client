/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { toRawNumericID } from '~/value-objects';
import { RawUpdatableNotification } from './raw-updatable-notification';
import { UpdatableNotification } from './updatable-notification';

export const toRawUpdatableNotification = (updatable: UpdatableNotification): RawUpdatableNotification =>
	omitUndefinedShallow({
		Msg: updatable.message,
		Type: updatable.customID === undefined ? undefined : toRawNumericID(updatable.customID),

		Sent: updatable.sentDate,
		Expires: updatable.expirationDate,
		IgnoreUntil: updatable.ignoreUntilDate,
	});
