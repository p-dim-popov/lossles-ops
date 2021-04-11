module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    babelOptions: {
      plugins: ['classPrivateMethods', 'classPrivateMembers'],
    },
  },
  plugins: [
  ],
  rules: {
    'no-undef': 'off',
  },
};
