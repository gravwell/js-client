/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { BroadcastedNotification, RawBroadcastedNotification } from './broadcasted-notification';
import { RawTargetedNotification, TargetedNotification } from './targeted-notification';

export type Notification = BroadcastedNotification | TargetedNotification;
export type RawNotification = RawBroadcastedNotification | RawTargetedNotification;
