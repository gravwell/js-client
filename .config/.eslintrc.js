module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'no-extra-semi': 'off',
		'curly': 'off',
		'no-mixed-spaces-and-tabs': 'off',

		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',

		'@typescript-eslint/array-type': ['error', { default: 'generic' }],

		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
	},
	overrides: [
		{
			files: ['**/*.spec.ts'],
			rules: {
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',
			},
		},
	],
};
