const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('@rollup/plugin-json/dist');
const { terser } = require('rollup-plugin-terser');

const packageJson = require('./package.json');

const dependencies = Object.keys(packageJson.dependencies);

const buildUmd = {
  input: 'lib/index.js',
  output: {
    file: packageJson.unpkg,
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

const buildCjs = {
  input: 'lib/index.js',
  output: {
    file: packageJson.main,
    format: 'cjs',
    exports: 'named'
  },
  external: (id) => {
    if (dependencies.includes(id)) {
      return true;
    }

    // url is a built-in module and should not be bundled either
    if (id === 'url') {
      return true;
    }

    // There are some deep imports of ajv files
    if (id.startsWith('ajv/')) {
      return true;
    }

    return false;
  },
  plugins: [
    resolve({
      browser: false,

      // Forbid bundling of NodeJS built-ins (i.e. "fs", "path").
      // Throw when such modules are present in the bundle.
      preferBuiltins: false
    }),
    json(),
    commonjs()
  ]
};

module.exports = [buildUmd, buildCjs];
