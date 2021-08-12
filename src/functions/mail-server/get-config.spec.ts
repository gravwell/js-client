/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/


describe('getMailServerConfig()', () => {
	const getMailServerConfig = makeGetMailServerConfig(TEST_BASE_API_CONTEXT);

	it(
		'Should return the mail server config',
		integrationTest(async () => {
			const config = await getMailServerConfig();
			expect(isMailServerConfig(config).toBeTrue());
		}),
	);
});
