/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Application, TSConfigReader } from 'typedoc';

/**
 * to understand how it works, checkout
 * https://typedoc.org/guides/installation/#node-module
 *
 * @param page the page that will generate the docs
 */
export const createTypedocPage = async <Type>(page: Type): Promise<void> => {
	const app = new Application();

	app.options.addReader(new TSConfigReader());
	app.options.addReader(new TSConfigReader());

	app.bootstrap({
		tsconfig: './tsconfig.json',
		entryPointStrategy: page['entryPointStrategy'],
		entryPoints: page['entryPoints'],
		readme: page['readme'],
	});

	const project = app.convert();

	if (project) {
		await app.generateDocs(project, page['outputDir']);
		await app.generateJson(project, page['outputDir'] + '/documentation.json');
	}
};
