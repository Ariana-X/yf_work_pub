module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-alert': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': 0,
    'linebreak-style': [0, 'error', 'windows'],
    'no-control-regex': 0,
    'global-require': 0,
    'no-multi-assign': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    "no-tabs":"off",
    'prefer-template': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
