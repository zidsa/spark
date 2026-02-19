// @ts-check
import eslint from '@eslint/js';
import * as pluginImportX from 'eslint-plugin-import-x';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import eslintPluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/*.gen.ts',
      '.output/**',
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'eslint.config.mjs',
      'prettier.config.js',
      'commitlint.config.cjs',
      'instrument.server.mjs',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      react: eslintPluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-console': 'error',

      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react/display-name': ['error', { ignoreTranspilerName: false, checkContextObjects: true }],

      'import-x/default': 'off',
      'import-x/namespace': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@zidsa/**', group: 'external', position: 'after' },
            { pattern: '@mui/**', group: 'external', position: 'after' },
            { pattern: '~/zidmui/**', group: 'internal', position: 'after' },
            { pattern: '~/global/**', group: 'internal', position: 'after' },
            { pattern: '~/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc' },
        },
      ],

      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['multiline-block-like'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['multiline-block-like'] },
      ],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: true,
          rootDir: 'src',
          prefix: '~',
          allowedDepth: 1,
        },
      ],
    },
  },
);
