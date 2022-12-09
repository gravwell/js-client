/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawBroadcastedNotification } from './raw-broadcasted-notification';
import { RawTargetedNotification } from './raw-targeted-notification';

export type RawNotification = RawBroadcastedNotification | RawTargetedNotification;
