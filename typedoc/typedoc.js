/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

const TypeDoc = require('typedoc');
const fs = require('fs');

const mainPage = {
	entryPointStrategy: 'Resolve',
	entryPoints: ['./src/functions', './src/models', './src/services', './src/tests', './src/value-objects'],
	outputDir: 'docs',
};

const functionsPage = {
	entryPointStrategy: 'Resolve',
	entryPoints: getEntryPoints('./src/functions'),
	outputDir: 'docs/modules/functions',
	readme: './typedoc/readme/functions.md',
};

const modelsPage = {
	entryPointStrategy: 'Resolve',
	entryPoints: getEntryPoints('./src/models'),
	outputDir: 'docs/modules/models',
};

const servicesPage = {
	entryPointStrategy: 'Resolve',
	entryPoints: getEntryPoints('./src/services'),
	outputDir: 'docs/modules/services',
};

const testsPage = {
	entryPointStrategy: 'Expand',
	entryPoints: ['./src/tests'],
	outputDir: 'docs/modules/tests',
};

const valueObjectsPage = {
	entryPointStrategy: 'Expand',
	entryPoints: ['./src/value-objects'],
	outputDir: 'docs/modules/value-objects',
};

function getEntryPoints(pathName) {
	const Folder = pathName;
	const subFolders = fs.readdirSync(Folder);
	return subFolders.map(subFolder => `${pathName}/${subFolder}`);
}

async function generateAllDocsPages() {
	await generateDocsPage(mainPage).then(() => setHomePage());
	generateDocsPage(functionsPage).then(() => setLinks('functions'));
	generateDocsPage(modelsPage).then(() => setLinks('models'));
	generateDocsPage(servicesPage).then(() => setLinks('services'));
	generateDocsPage(testsPage).then(() => setLinks('tests'));
	generateDocsPage(valueObjectsPage).then(() => setLinks('value-objects'));
}

generateAllDocsPages();

async function generateDocsPage(page) {
	const app = new TypeDoc.Application();

	// If you want TypeDoc to load tsconfig.json / typedoc.json files
	app.options.addReader(new TypeDoc.TSConfigReader());
	app.options.addReader(new TypeDoc.TypeDocReader());

	app.bootstrap({
		tsconfig: './tsconfig.json',
		entryPointStrategy: page.entryPointStrategy,
		entryPoints: page.entryPoints,
		readme: page.readme,
	});

	const project = app.convert();

	if (project) {
		// Rendered docs
		await app.generateDocs(project, page.outputDir);
		// Alternatively generate JSON output
		await app.generateJson(project, page.outputDir + '/documentation.json');
	}
}

function setHomePage() {
	fs.unlinkSync('./docs/index.html');
	fs.copyFileSync('./typedoc/index.html', 'docs/index.html');
}

function setLinks(pageName) {
	const code = `
	<script> 
	const headerLinkElement = document.getElementsByClassName('title')[0];
	headerLinkElement.href = '../../index.html'; // will make header link point to the first page
	const modulesLinkElement = document.getElementsByClassName('current')[0].children[0];
	modulesLinkElement.href = ''; // will remove the link from modules
	</script>
	`;
	fs.appendFileSync(`./docs/modules/${pageName}/index.html`, code);

	const childCode = `
	<script> 
	const headerLinkElement = document.getElementsByClassName('title')[0];
	headerLinkElement.href = '../../../index.html'; // will make header link point to the first page
	const modulesLinkElement = document.getElementsByClassName('primary')[0].children[0].children[0];
	modulesLinkElement.remove(); // will remove the tag modules
	const breadCrumbElement = document.getElementsByClassName('tsd-breadcrumb')[0];
	breadCrumbElement.remove(); // will remove the bread-crum element
	</script>
	`;

	const modulesFolder = `./docs/modules/${pageName}/modules`;
	const modulesFiles = fs.readdirSync(modulesFolder);

	for (const fileName of modulesFiles) {
		fs.appendFileSync(`${modulesFolder}/${fileName}`, childCode);
	}
}
