module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import'],
  env: {
    mocha: true,
    node: true
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',

    // Temporary overrides. Logic to be rewritten.
    // TODO https://github.com/apiaryio/gavel.js/issues/150
    'no-param-reassign': 'off'
  }
};
