const { execSync } = require('child_process');

const typescriptVersions = ['3.5', '3.6', '3.7', '3.8', '3.9', '4.0', '4.1'];

/**
 * @param {string} version
 * @returns {void}
 */
const testVersionCompatibility = version => {
	try {
		console.log(`Will test package usage with TypeScript v${version}`);
		console.log(`TS v${version} will install`);
		execSync('npm i -D typescript@' + version);
		console.log(`TS v${version} installed`);
		console.log(`TS v${version} will compile`);
		execSync('npx tsc');
		console.log(`TS v${version} compiled`);

		console.log(`TS v${version} SUCCESS`);
	} catch {
		console.log(`TS v${version} FAILED`);
	} finally {
		console.log(`TS v${version} will uninstall`);
		execSync('npm uninstall typescript');
		console.log(`TS v${version} uninstalled`);
	}
};

for (const version of typescriptVersions) {
	execSync('npm ci');
	testVersionCompatibility(version);
}
