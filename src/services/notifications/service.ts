/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { MyNotificationsMessageReceived } from '~/functions/notifications';
import { APISubscription } from '~/functions/utils';
import {
	CreatableBroadcastNotification,
	CreatableTargetedNotificationByTargetType,
	Notification,
	TargetedNotificationTargetType,
	UpdatableNotification,
} from '~/models/notification';

export interface NotificationsService {
	readonly create: {
		readonly one: {
			readonly broadcasted: (creatable: CreatableBroadcastNotification) => Promise<void>;
			readonly targeted: <TargetType extends TargetedNotificationTargetType>(
				targetType: TargetType,
				creatable: Omit<CreatableTargetedNotificationByTargetType<TargetType>, 'targetType'>,
			) => Promise<void>;
		};
	};

	readonly get: {
		readonly mine: () => Promise<Array<Notification>>;
	};

	readonly subscribeTo: {
		readonly mine: (options?: {
			pollInterval?: number | undefined;
		}) => Promise<APISubscription<MyNotificationsMessageReceived, never>>;
	};

	readonly update: {
		readonly one: (updatable: UpdatableNotification) => Promise<void>;
	};

	readonly delete: {
		readonly one: (userID: string) => Promise<void>;
	};
}
