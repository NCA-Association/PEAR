module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    'frontend/dist/',
    'frontend/node_modules/',
    'server/node_modules/',
    'node_modules/',
  ],
  extends: ['eslint:recommended'],
  rules: {
    camelcase: 'off',
    'consistent-return': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
