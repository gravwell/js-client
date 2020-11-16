/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Host } from './host';

describe('Host', () => {
	it("Should throw if it's not a valid host", () => {
		const invalidHosts: Array<string> = [
			'http://www.example.com',
			'example',
			'example.com/path',
			'example.com?query=value',
		];

		for (const invalidHost of invalidHosts) expect(() => new Host(invalidHost)).toThrow();
	});

	it("Should instantiate if it's a valid host", () => {
		const validHosts: Array<string> = [
			'www.example.com',
			'www.example.com.br',
			'example.com.br',
			'example.com',
			'localhost',
			'www.example.com:4200',
			'www.example.com.br:9999',
			'example.com.br:2000',
			'example.com:8080',
			'localhost:3000',
		];

		for (const validHost of validHosts) expect(() => new Host(validHost)).not.toThrow();
	});
});
