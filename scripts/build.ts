import { exec } from 'child_process';
import { argv } from 'yargs';
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
	await execAsync('npx rimraf src-tsc dist-tsc dist/node');

	debug('Copying TypeScript files to src-tsc');
	await execAsync('npx copyfiles --up=1 "src/**/*.ts" src-tsc');

	debug('Deleting non Node TypeScript files');
	await execAsync('npx rimraf src-tsc/**/*.d.ts src-tsc/**/*.browsers.ts');

	debug('Replacing original files for *.node.* ones');
	await execAsync('npx rename -f "src-tsc/**/*.node.*" "{{f|replace|.node|}}"');

	debug('Transpiling TypeScript files');
	const tsconfig = '.config/tsconfig.' + (INCLUDE_TESTS ? 'node-spec' : 'node-build') + '.json';
	await execAsync(`npx tsc -p ${tsconfig}`);

	debug('Copying files to dist/node');
	await execAsync('npx copyfiles --up=1 "dist-tsc/**/*" dist/node');
	if (INCLUDE_ASSETS) await execAsync('npx copyfiles --up=1 "src/**/!(*.ts)" dist/node');

	debug('Cleaning the TypeScript builds');
	await execAsync('npx rimraf src-tsc dist-tsc');

	endDebugContext();
};

const buildBrowsers = async (): Promise<void> => {
	startDebugContext('Browsers', ['blue']);

	debug('Cleaning the last build');
	await execAsync('npx rimraf src-tsc dist-tsc dist/browsers');

	debug('Copying TypeScript files to src-tsc');
	await execAsync('npx copyfiles --up=1 "src/**/*.ts" src-tsc');

	debug('Deleting non browser TypeScript files');
	await execAsync('npx rimraf src-tsc/**/*.d.ts src-tsc/**/*.node.ts');

	debug('Replacing original files for *.browsers.* ones');
	await execAsync('npx rename -f "src-tsc/**/*.browsers.*" "{{f|replace|.browsers|}}"');

	debug('Transpiling TypeScript files');
	const tsconfig = '.config/tsconfig.' + (INCLUDE_TESTS ? 'browsers-spec' : 'browsers-build') + '.json';
	await execAsync(`npx tsc -p ${tsconfig}`);

	debug('Copying files to dist/browsers');
	await execAsync('npx copyfiles --up=1 "dist-tsc/**/*" dist/browsers');
	if (INCLUDE_ASSETS) await execAsync('npx copyfiles --up=1 "src/**/!(*.ts)" dist/browsers');

	debug('Cleaning the TypeScript builds');
	await execAsync('npx rimraf src-tsc dist-tsc');

	endDebugContext();
};

(async () => {
	startDebugContext('Build', ['red', 'bold']);
	debug(`Will build for ${BUILD_ENVIRONMENTS.join(' and ')}`);

	if (BUILD_ENVIRONMENTS.includes('Node')) await buildNode();
	if (BUILD_ENVIRONMENTS.includes('Browsers')) await buildBrowsers();
})();
