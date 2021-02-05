/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneBroadcastedNotification,
	makeCreateOneTargetedNotification,
	makeDeleteOneNotification,
	makeGetMyNotifications,
	makeSubscribeToMyNotifications,
	makeUpdateOneNotification,
} from '~/functions/notifications';
import { APIContext } from '~/functions/utils';
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
