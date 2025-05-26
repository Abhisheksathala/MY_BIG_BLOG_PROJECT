import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react'; // ✅ import it
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react, // ✅ register react plugin
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules, // ✅ add react recommended rules
      ...reactHooks.configs.recommended.rules,

      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      semi: ['error', 'always'],
      'array-bracket-spacing': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      camelcase: ['error', { properties: 'never' }],
      'react/prop-types': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ✅ These will now work properly
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      // ✅ Catch undefined variables used without imports
      'no-undef': 'error',
    },
  },
];
