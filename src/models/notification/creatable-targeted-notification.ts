/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { constant, Decoder, either3, Guard, guard, object, optional, string } from 'decoders';
import { mkTypeGuard } from '../../functions/utils/type-guards';

interface CreatableBaseTargetedNotification {
	message: string;
	customID?: string;

	sentDate?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	ignoreUntilDate?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
}

const creatableBaseTargetedNotificationDecoderFields = {
	message: string,
	customID: optional(string),

	sentDate: optional(string),
	expirationDate: optional(string),
	ignoreUntilDate: optional(string),
};

export interface CreatableMyselfTargetedNotification extends CreatableBaseTargetedNotification {
	targetType: 'myself';
}

export const creatableMyselfTargetedNotificationDecoder: Decoder<CreatableMyselfTargetedNotification> = object({
	targetType: constant('myself'),
	...creatableBaseTargetedNotificationDecoderFields,
});

export interface CreatableGroupTargetedNotification extends CreatableBaseTargetedNotification {
	targetType: 'group';

	/** ID of the group targeted by the notification */
	groupID: string;
}

export const creatableGroupTargetedNotificationDecoder: Decoder<CreatableGroupTargetedNotification> = object({
	targetType: constant('group'),
	groupID: string,
	...creatableBaseTargetedNotificationDecoderFields,
});

export interface CreatableUserTargetedNotification extends CreatableBaseTargetedNotification {
	targetType: 'user';

	/** ID of the user targeted by the notification */
	userID: string;
}

export const creatableUserTargetedNotificationDecoder: Decoder<CreatableUserTargetedNotification> = object({
	targetType: constant('user'),
	userID: string,
	...creatableBaseTargetedNotificationDecoderFields,
});

export type CreatableTargetedNotification =
	| CreatableMyselfTargetedNotification
	| CreatableGroupTargetedNotification
	| CreatableUserTargetedNotification;

export const creatableTargetedNotificationDecoder: Decoder<CreatableTargetedNotification> = either3(
	creatableMyselfTargetedNotificationDecoder,
	creatableGroupTargetedNotificationDecoder,
	creatableUserTargetedNotificationDecoder,
);

export const creatableTargetedNotificationGuard: Guard<CreatableTargetedNotification> = guard(
	creatableTargetedNotificationDecoder,
);

export const isCreatableTargetedNotification = mkTypeGuard(creatableTargetedNotificationDecoder);
