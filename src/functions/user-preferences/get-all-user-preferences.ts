/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';
import { ID } from '../../value-objects/id';
import { decode as base64decode } from 'base-64';

type ParsedUserPreferences = { userID: ID; lastUpdateDate: Date; preferences: UserPreferences };
type UsersPreferencesJSON = {
	UID: number;
	Name: string;
	Updated: string;
	Data: string;
}[];
export const makeGetAllUserPreferences = (context: APIContext) => async (): Promise<Array<ParsedUserPreferences>> => {
	const templatePath = '/api/users/preferences';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });
	const req = buildHTTPRequestWithAuthFromContext(context);
	const raw = await fetch(url, { ...req, method: 'GET' });

	//send raw to conversion
	const response = await parseUserResponse(raw);
	return response;
};
async function parseUserResponse(raw: Response) {
	const parsedUserDataList = [];
	//convert to JSON
	const parsedRawResponseList = (await parseJSONResponse(raw)) as UsersPreferencesJSON;
	for (let i = 0; i < parsedRawResponseList.length; i++) {
		//get data from raw
		const { UID: userUID, Updated: userUpdatedDate } = parsedRawResponseList[i];
		//get data from raw Data and convert do JSON
		const decodedUserPreferences = base64decode(parsedRawResponseList[i].Data);
		const userPreferenceObj = JSON.parse(decodedUserPreferences);

		//* parse data
		const parsedUserData = {
			userID: userUID.toString(),
			lastUpdateDate: new Date(userUpdatedDate),
			preferences: userPreferenceObj,
		} as ParsedUserPreferences;
		//push to array
		parsedUserDataList.push(parsedUserData);
	}

	return parsedUserDataList;
}
