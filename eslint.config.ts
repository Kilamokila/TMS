import { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const plugins = {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    prettier: prettierPlugin,
    '@typescript-eslint': tseslint.plugin,
};

const baseConfig: FlatConfig.Config[] = [js.configs.recommended, ...tseslint.configs.recommended];

const tsxConfig: FlatConfig.Config = {
    files: ['src/**/*.{ts,tsx}'],
    plugins,
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
            ...globals.browser,
            ...globals.node,
        },
        parser: tseslint.parser,
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: __dirname,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/display-name': 'error',
        'react/jsx-key': 'error',
        'react/jsx-no-comment-textnodes': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/require-render-return': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-curly-spacing': 'off',
        '@typescript-eslint/no-array-constructor': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'object-curly-spacing': ['error', 'always'],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
            { blankLine: 'always', prev: 'directive', next: '*' },
            { blankLine: 'always', prev: 'block-like', next: '*' },
            { blankLine: 'always', prev: '*', next: 'block-like' },
            { blankLine: 'always', prev: 'import', next: '*' },
            { blankLine: 'any', prev: 'import', next: 'import' },
        ],
    },
};

const viteConfig: FlatConfig.Config = {
    files: ['vite.config.ts'],
    plugins: {
        '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
            ...globals.node,
        },
        parser: tseslint.parser,
        parserOptions: {
            project: './tsconfig.node.json',
            tsconfigRootDir: __dirname,
        },
    },
};

const config: FlatConfig.ConfigArray = tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', '*.min.js', '*.log'],
    },
    ...baseConfig,
    tsxConfig,
    viteConfig,
);

export default config;
