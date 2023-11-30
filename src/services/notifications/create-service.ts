/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneBroadcastedNotification } from '~/functions/notifications/create-one-broadcasted-notification';
import { makeCreateOneTargetedNotification } from '~/functions/notifications/create-one-targeted-notification';
import { makeDeleteOneNotification } from '~/functions/notifications/delete-one-notification';
import { makeGetMyNotifications } from '~/functions/notifications/get-my-notifications';
import { makeSubscribeToMyNotifications } from '~/functions/notifications/subscribe-to-my-notifications';
import { makeUpdateOneNotification } from '~/functions/notifications/update-one-notification';
import { APIContext } from '~/functions/utils/api-context';
import { NotificationsService } from './service';

export const createNotificationsService = (context: APIContext): NotificationsService => ({
	create: {
		one: {
			broadcasted: makeCreateOneBroadcastedNotification(context),
			targeted: makeCreateOneTargetedNotification(context),
		},
	},

	get: {
		mine: makeGetMyNotifications(context),
	},

	subscribeTo: {
		mine: makeSubscribeToMyNotifications(context),
	},

	update: {
		one: makeUpdateOneNotification(context),
	},

	delete: {
		one: makeDeleteOneNotification(context),
	},
});
