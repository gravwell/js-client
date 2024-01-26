/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	CreatableTargetedNotification,
	creatableTargetedNotificationDecoder,
} from '~/models/notification/creatable-targeted-notification';
import { CreatableTargetedNotificationByTargetType } from '~/models/notification/creatable-targeted-notification-by-target-type';
import { TargetedNotificationTargetType } from '~/models/notification/targeted-notification';
import { toRawCreatableTargetedNotification } from '~/models/notification/to-raw-creatable-targeted-notification';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL, URLOptions } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneTargetedNotification =
	(context: APIContext) =>
	async <TargetType extends TargetedNotificationTargetType>(
		targetType: TargetType,
		creatable: Omit<CreatableTargetedNotificationByTargetType<TargetType>, 'targetType'>,
	): Promise<void> => {
		try {
			// There may be some trick to make {...creatable, targetType} pass as a CreatableTargetedNotification,
			// but I couldn't make it work. Until someone figures that out, this guard will work.
			const _creatable: CreatableTargetedNotification = creatableTargetedNotificationDecoder.verify({
				...creatable,
				targetType,
			});
			const url = _buildURL(_creatable, { ...context, protocol: 'http' });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableTargetedNotification(_creatable)),
				headers: { 'Content-Type': 'application/json' },
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
