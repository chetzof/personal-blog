// @ts-check
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  extends: ['./node_modules/chetzof-lint-config/eslint/index.js'],
  overrides: [
    {
      files: ['*.ts', '*.js'],
      parser: '@typescript-eslint/parser',
      rules: {
        'import/no-unused-modules': 'off',
      },
      parserOptions: {
        project: ['./tsconfig.json', './packages/**/tsconfig.json'],
      },
    },
  ],
})
