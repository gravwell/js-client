/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	CreatableTargetedNotification,
	CreatableTargetedNotificationByTargetType,
	creatableTargetedNotificationGuard,
	TargetedNotificationTargetType,
	toRawCreatableTargetedNotification,
} from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
	URLOptions,
} from '../utils';

export const makeCreateOneTargetedNotification =
	(context: APIContext) =>
	async <TargetType extends TargetedNotificationTargetType>(
		targetType: TargetType,
		creatable: Omit<CreatableTargetedNotificationByTargetType<TargetType>, 'targetType'>,
	): Promise<void> => {
		try {
			// There may be some trick to make {...creatable, targetType} pass as a CreatableTargetedNotification,
			// but I couldn't make it work. Until someone figures that out, this guard will work.
			const _creatable: CreatableTargetedNotification = creatableTargetedNotificationGuard({
				...creatable,
				targetType,
			});
			const url = _buildURL(_creatable, { ...context, protocol: 'http' });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableTargetedNotification(_creatable)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
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
