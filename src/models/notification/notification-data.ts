/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { BroadcastedNotification } from './broadcasted-notification';
import { TargetedNotification } from './targeted-notification';

export type NotificationData = BroadcastedNotification | TargetedNotification;
