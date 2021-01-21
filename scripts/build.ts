import { exec } from 'child_process';
import { argv } from 'yargs';
import { improveTypescriptCompatibility } from './improve-typescript-compatibility';
import { makeDebug } from './utils';

const QUIET: boolean = !!argv.quiet || !!argv.q;
const { debug, startDebugContext, endDebugContext } = makeDebug(() => !QUIET);

const INCLUDE_ASSETS: boolean = !!argv.assets;
const INCLUDE_TESTS: boolean = !!argv.tests;

type BuildEnvironment = 'Node' | 'Browsers';
const BUILD_ENVIRONMENTS = ((): Array<BuildEnvironment> => {
	if (argv.nodeOnly) return ['Node'];
	if (argv.browsersOnly) return ['Browsers'];
	return ['Node', 'Browsers'];
})();
if (BUILD_ENVIRONMENTS.length === 0) throw Error('No build environment');

const execAsync = (command: string): Promise<string> =>
	new Promise((resolve, reject) => {
		exec(command, (err, stdout, stderr) => {
			if (err) reject(err);
			else resolve(stdout);
		});
	});

const buildNode = async (): Promise<void> => {
	startDebugContext('Node', ['green']);

	debug('Cleaning the last build');
	await execAsync('npx rimraf "dist-tsc" "dist/node"');

	debug('Transpiling TypeScript files');
	const tsconfig = '.config/tsconfig.' + (INCLUDE_TESTS ? 'node-spec' : 'node-build') + '.json';
	await execAsync(`npx tsc -p ${tsconfig}`);

	debug('Replacing transpiled files for *.node.* ones');
	await execAsync('npx rename -f "dist-tsc/**/*.node.*" "{{f|replace|.node|}}"');

	debug('Copying files to dist/node');
	await execAsync('npx copyfiles --up=1 "dist-tsc/**/*" dist/node');
	if (INCLUDE_ASSETS) await execAsync('npx copyfiles --up=1 "src/**/!(*.ts)" dist/node');

	debug('Generating types from browser files');
	await execAsync('npx rimraf "dist-tsc"');
	const browsersTsconfig = '.config/tsconfig.' + (INCLUDE_TESTS ? 'browsers-spec' : 'browsers-build') + '.json';
	await execAsync(`npx tsc -p ${browsersTsconfig}`);
	await execAsync('npx rimraf "dist-tsc/**/*.node.ts"');
	await execAsync('npx copyfiles --up=1 "dist-tsc/**/*.d.ts" dist/node');

	debug('Cleaning the TypeScript builds');
	await execAsync('npx rimraf "dist-tsc"');

	endDebugContext();
};

const buildBrowsers = async (): Promise<void> => {
	startDebugContext('Browsers', ['blue']);

	debug('Cleaning the last build');
	await execAsync('npx rimraf "dist-tsc" "dist/browsers"');

	debug('Transpiling TypeScript files');
	const tsconfig = '.config/tsconfig.' + (INCLUDE_TESTS ? 'browsers-spec' : 'browsers-build') + '.json';
	await execAsync(`npx tsc -p ${tsconfig}`);

	debug('Copying files to dist/browsers');
	await execAsync('npx copyfiles --up=1 "dist-tsc/**/*" dist/browsers');
	if (INCLUDE_ASSETS) await execAsync('npx copyfiles --up=1 "src/**/!(*.ts)" dist/browsers');

	debug('Cleaning the TypeScript builds');
	await execAsync('npx rimraf "dist-tsc"');

	endDebugContext();
};

(async () => {
	startDebugContext('Build', ['red', 'bold']);
	debug(`Will build for ${BUILD_ENVIRONMENTS.join(' and ')}`);

	if (BUILD_ENVIRONMENTS.includes('Node')) await buildNode();
	if (BUILD_ENVIRONMENTS.includes('Browsers')) await buildBrowsers();

	debug(`Improving typescript compatibility`);
	await improveTypescriptCompatibility('dist');
})();
