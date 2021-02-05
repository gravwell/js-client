/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	CreatableTargetedNotification,
	CreatableTargetedNotificationByTargetType,
	TargetedNotificationTargetType,
	toRawCreatableTargetedNotification,
} from '~/models';
import {
	APIContext,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
	URLOptions,
} from '../utils';

export const makeCreateOneTargetedNotification = (context: APIContext) => {
	return async <TargetType extends TargetedNotificationTargetType>(
		targetType: TargetType,
		creatable: Omit<CreatableTargetedNotificationByTargetType<TargetType>, 'targetType'>,
	): Promise<void> => {
		try {
			const _creatable: CreatableTargetedNotification = { ...creatable, targetType: targetType as any };
			const url = _buildURL(_creatable, { ...context, protocol: 'http' });

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawCreatableTargetedNotification(_creatable)),
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
