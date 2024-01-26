/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { MyNotificationsMessageReceived } from '~/functions/notifications/subscribe-to-my-notifications';
import { APISubscription } from '~/functions/utils/api-subscription';
import { CreatableBroadcastNotification } from '~/models/notification/creatable-broadcasted-notification';
import { CreatableTargetedNotificationByTargetType } from '~/models/notification/creatable-targeted-notification-by-target-type';
import { Notification } from '~/models/notification/notification';
import { TargetedNotificationTargetType } from '~/models/notification/targeted-notification';
import { UpdatableNotification } from '~/models/notification/updatable-notification';

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
