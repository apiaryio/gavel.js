const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('@rollup/plugin-json/dist');
const { terser } = require('rollup-plugin-terser');

const packageJson = require('./package.json');

const buildUmd = {
  input: 'lib/index.js',
  output: {
    file: packageJson.main,
    format: 'umd',
    name: 'gavel',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true,

      // Forbid bundling of NodeJS built-ins (i.e. "fs", "path").
      // Throw when such modules are present in the bundle.
      preferBuiltins: false
    }),
    json(),
    commonjs(),
    terser()
  ]
};

module.exports = [buildUmd];
