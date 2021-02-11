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
		project: [
			'./.config/tsconfig.browsers-build.json',
			'./.config/tsconfig.browsers-spec.json',
			'./.config/tsconfig.node-build.json',
			'./.config/tsconfig.node-spec.json',
		],
	},
	plugins: ['@typescript-eslint', 'simple-import-sort', 'import'],
	rules: {
		'no-extra-semi': 'off',
		'curly': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'no-unused-vars': 'off',

		'sort-imports': 'off',
		'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']] }],
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'error',

		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',

		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/array-type': ['error', { default: 'generic' }],
	},
	overrides: [
		{
			files: ['**/*.spec.ts'],
			rules: {
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',
			},
		},
	],
};
