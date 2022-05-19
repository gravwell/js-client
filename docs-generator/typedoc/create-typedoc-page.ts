/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Application, TSConfigReader } from 'typedoc';

// This function will generate the docsPage
// to understand how it works, checkout https://typedoc.org/guides/installation/#node-module
export const createTypedocPage = async <Type>(page: Type): Promise<void> => {
	const app = new Application();

	// If you want TypeDoc to load tsconfig.json / typedoc.json files
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
		// Rendered docs
		await app.generateDocs(project, page['outputDir']);
		// Alternatively generate JSON output
		await app.generateJson(project, page['outputDir'] + '/documentation.json');
	}
};
