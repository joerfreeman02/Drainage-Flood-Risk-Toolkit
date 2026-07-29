import js from '@eslint/js';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        AbortController: 'readonly', Blob: 'readonly', document: 'readonly',
        window: 'readonly', navigator: 'readonly', localStorage: 'readonly',
        URL: 'readonly', URLSearchParams: 'readonly', crypto: 'readonly',
        fetch: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
        globalThis: 'readonly', console: 'readonly', process: 'readonly',
        __BUILD_TIME__: 'readonly', __BUILD_COMMIT__: 'readonly'
      }
    }
  }
];
