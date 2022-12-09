/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	CreatableGroupTargetedNotification,
	CreatableMyselfTargetedNotification,
	CreatableUserTargetedNotification,
} from './creatable-targeted-notification';
import { TargetedNotificationTargetType } from './targeted-notification';

export type CreatableTargetedNotificationByTargetType<TargetType extends TargetedNotificationTargetType> =
	TargetType extends 'myself'
		? CreatableMyselfTargetedNotification
		: TargetType extends 'group'
		? CreatableGroupTargetedNotification
		: TargetType extends 'user'
		? CreatableUserTargetedNotification
		: never;
