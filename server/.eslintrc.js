module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    camelcase: 'off',
    'consistent-return': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '_|(knex)', destructuredArrayIgnorePattern: '^_' }],
  },
};
