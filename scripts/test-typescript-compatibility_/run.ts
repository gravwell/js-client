import { execSync } from 'child_process';
import { DebugStyle, makeDebug } from '../utils';

const TYPESCRIPT_VERSIONS = ['3.5', '3.6', '3.7', '3.8', '3.9', '4.0', '4.1'];

const { debug, startDebugContext, endDebugContext } = makeDebug();

const testVersionCompatibility = (version: string, color: DebugStyle = 'blue'): boolean => {
	let isCompatible = false;

	try {
		startDebugContext(`v${version}`, [color]);

		debug(`Installing`);
		execSync('npm i -D typescript@' + version, { stdio: 'ignore' });

		debug(`Compiling`);
		execSync('npx tsc', { stdio: 'ignore' });

		debug(`✅ SUCCESS`);
		isCompatible = true;
	} catch {
		debug(`❌ FAILED`);
		isCompatible = false;
	} finally {
		endDebugContext();
		return isCompatible;
	}
};

(() => {
	startDebugContext('Typescript compatibility test', ['cyan', 'bold']);

	const formattedVersions = TYPESCRIPT_VERSIONS.map(v => `v${v}`).join(', ');
	debug(`Will test with ${formattedVersions}`);
	execSync('npm ci', { stdio: 'ignore' });

	const versionColors: Array<DebugStyle> = ['blue', 'magenta', 'yellow'];
	const versionsCompatibility = TYPESCRIPT_VERSIONS.map((version, i) => ({
		version,
		isCompatible: testVersionCompatibility(version, versionColors[i % versionColors.length]),
	}));
	const allCompatible = versionsCompatibility.every(v => v.isCompatible);

	debug(`Uninstalling`);
	execSync('npm uninstall typescript', { stdio: 'ignore' });

	startDebugContext('Report', allCompatible ? ['green', 'bold'] : ['red', 'bold']);
	for (const v of versionsCompatibility)
		if (v.isCompatible) debug(`✅ v${v.version} compatible`);
		else debug(`❌ v${v.version} not compatible`);
	endDebugContext();

	endDebugContext();

	process.exit(allCompatible ? 0 : 1);
})();
