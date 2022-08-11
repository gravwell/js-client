/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext } from '../functions/utils';

export const getRunnerSettings = (): Promise<{
	context: APIContext;
	unitTests: boolean;
	integrationTests: boolean;
}> => {
	console.log('Using browser settings for JS Client tests');
	return Promise.resolve({
		context: { host: '', useEncryption: false, authToken: null, fetch },
		unitTests: true,
		integrationTests: false,
	});
};
