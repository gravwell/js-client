/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
	URLOptions,
} from '../utils';

export const makeCreateOneTargetedNotification = (makerOptions: APIFunctionMakerOptions) => {
	// Had to curry that function so that the correct CreatableTargetedNotification wouldn't be lost
	// when I lazyfirst() the auth token in the client
	return (authToken: string | null) => async <TargetType extends TargetedNotificationTargetType>(
		targetType: TargetType,
		creatable: Omit<CreatableTargetedNotificationByTargetType<TargetType>, 'targetType'>,
	): Promise<void> => {
		try {
			const _creatable: CreatableTargetedNotification = { ...creatable, targetType: targetType as any };
			const url = _buildURL(_creatable, { ...makerOptions, protocol: 'http' });

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toCreatableRaw(_creatable)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

const _buildURL = (creatable: CreatableTargetedNotification, baseOptions: URLOptions): string => {
	switch (creatable.targetType) {
		case 'myself': {
			const templatePath = '/api/notifications/targeted/self';
			return buildURL(templatePath, baseOptions);
		}
		case 'user': {
			const templatePath = '/api/notifications/targeted';
			// const templatePath = '/api/notifications/targeted/user/{userID}';
			return buildURL(templatePath, baseOptions, { pathParams: { userID: creatable.userID } });
		}
		case 'group': {
			const templatePath = '/api/notifications/targeted';
			// const templatePath = '/api/notifications/targeted/group/{groupID}';
			return buildURL(templatePath, baseOptions, { pathParams: { groupID: creatable.groupID } });
		}
	}
};

export type TargetedNotificationTargetType = CreatableTargetedNotification['targetType'];
type CreatableTargetedNotificationByTargetType<
	TargetType extends TargetedNotificationTargetType
> = TargetType extends 'myself'
	? CreatableMyselfTargetedNotification
	: TargetType extends 'group'
	? CreatableGroupTargetedNotification
	: TargetType extends 'user'
	? CreatableUserTargetedNotification
	: never;

export type CreatableTargetedNotification =
	| CreatableMyselfTargetedNotification
	| CreatableGroupTargetedNotification
	| CreatableUserTargetedNotification;

export interface CreatableMyselfTargetedNotification extends CreatableBaseTargetedNotification {
	targetType: 'myself';
}

export interface CreatableGroupTargetedNotification extends CreatableBaseTargetedNotification {
	targetType: 'group';

	/**
	 * ID of the group targeted by the notification
	 */
	groupID: string;
}

export interface CreatableUserTargetedNotification extends CreatableBaseTargetedNotification {
	targetType: 'user';

	/**
	 * ID of the user targeted by the notification
	 */
	userID: string;
}

interface CreatableBaseTargetedNotification {
	message: string;
	customID?: string;

	sentDate?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	ignoreUntilDate?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
}

type RawCreatableTargetedNotification =
	| RawCreatableMyselfTargetedNotification
	| RawCreatableGroupTargetedNotification
	| RawCreatableUserTargetedNotification;

interface RawCreatableMyselfTargetedNotification extends RawCreatableBaseTargetedNotification {
	UID: 0;
	GID: 0;
}

interface RawCreatableGroupTargetedNotification extends RawCreatableBaseTargetedNotification {
	UID: 0;
	GID: number; // 0 is undefined
}

interface RawCreatableUserTargetedNotification extends RawCreatableBaseTargetedNotification {
	UID: number; // 0 is undefined
	GID: 0;
}

interface RawCreatableBaseTargetedNotification {
	Type?: number;
	Broadcast: false;
	Sent?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	Expires?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	IgnoreUntil?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
	Msg: string;
}

const toCreatableRaw = (creatable: CreatableTargetedNotification): RawCreatableTargetedNotification => {
	const base: RawCreatableBaseTargetedNotification = {
		Msg: creatable.message,
		Type: creatable.customID === undefined ? undefined : toRawNumericID(creatable.customID),
		Broadcast: false,

		Sent: creatable.sentDate,
		Expires: creatable.expirationDate,
		IgnoreUntil: creatable.ignoreUntilDate,
	};

	switch (creatable.targetType) {
		case 'myself':
			return omitUndefinedShallow<RawCreatableMyselfTargetedNotification>({ ...base, GID: 0, UID: 0 });
		case 'group':
			return omitUndefinedShallow<RawCreatableGroupTargetedNotification>({
				...base,
				UID: 0,
				GID: toRawNumericID(creatable.groupID),
			});
		case 'user':
			return omitUndefinedShallow<RawCreatableUserTargetedNotification>({
				...base,
				GID: 0,
				UID: toRawNumericID(creatable.userID),
			});
	}
};
