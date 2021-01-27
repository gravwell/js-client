#!/usr/bin/env node

import * as fs from 'fs';
import { join } from 'path';
const {
	lstatSync,
	promises: { readFile, writeFile, readdir },
} = fs;

interface ProcessableFile {
	filename: string;
	data: string;
	fullPath: string;
}

const isDeclarationFile = (file: string): boolean => file.endsWith('.d.ts');

const getDeclarationFiles = async (dirPath: string): Promise<Array<ProcessableFile>> => {
	const shallowFileInfos = (await readdir(dirPath)).map(filename => {
		const fullPath = join(dirPath, filename);
		return { filename, fullPath };
	});

	const shallowFilesP = shallowFileInfos
		.filter(({ filename }) => isDeclarationFile(filename))
		.map(async info => {
			const data = (await readFile(info.fullPath)).toString();
			return { ...info, data };
		});
	const shallowFiles = await Promise.all(shallowFilesP);

	const deepFilesP = shallowFileInfos
		.map(({ fullPath }) => fullPath)
		.filter(fullPath => lstatSync(fullPath).isDirectory())
		.map(getDeclarationFiles);
	const deepFiles = (await Promise.all(deepFilesP)).reduce((acc, curr) => acc.concat(curr), []);

	const allFiles = shallowFiles.concat(deepFiles);
	return allFiles;
};

const processFile = async (file: ProcessableFile): Promise<ProcessableFile> => {
	const data = file.data
		// TS<3.8 - Replace "import type {x} from 'x'" with "import {x} from 'x'"
		.replace(/import type/g, 'import')
		// TS<3.7 - Replace get/set x for "x: T"
		.replace(/set (\w+)\(\w+\: [\w\s\|\<\>]+\);\n\s*get \w+\(\): ([\w\s\|\<\>]+);/g, '$1: $2; // TSCompatibility')
		// TS<3.7 - Replace get x for "readonly x: T"
		.replace(
			/(?<!set \w+\(\w+\: [\w\s\|\<\>]+\);\n\s*)get (\w+)\(\): ([\w\s\|\<\>]+);/g,
			'readonly $1: $2; // TSCompatibility',
		)
		// TS<3.7 - Replace class initializers e.g. "message = 'test';" for "message: 'test';"
		.replace(/readonly (\w+) =/g, 'readonly $1:');
	return { ...file, data };
};

export const improveTypescriptCompatibility = async (declarationsPath: string): Promise<void> => {
	const files = await getDeclarationFiles(declarationsPath);
	const promises = files.map(async file => {
		const processed = await processFile(file);
		await writeFile(processed.fullPath, processed.data);
	});
	await Promise.all(promises);
};
