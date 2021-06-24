import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import componentsIndexes from './src/index.json'; // compiled during prebuild

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};
const input = ['src/index.ts', ...componentsIndexes];
const output = {
  entryFileNames: '[name].js',
  esModule: true,
  exports: 'auto',
  globals,
  preserveModules: true,
  preserveModulesRoot: 'src',
  sourcemap: true,
};
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
const commonjsOptions = {};
const nodeResolveOptions = {
  extensions: ['.js', '.tsx', '.ts'],
};

const rollupConfig = [
  {
    input,
    output: {
      ...output,
      dir: 'dist/cjs',
      format: 'cjs',
    },
    external,
    plugins: [
      peerDepsExternal(),
      nodeResolve(nodeResolveOptions),
      commonjs(commonjsOptions),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: 'dist/cjs',
          },
        },
      }),
      postcss(),
    ],
  },
  {
    input,
    output: {
      ...output,
      dir: 'dist/esm',
      format: 'esm',
    },
    external,
    plugins: [
      peerDepsExternal(),
      nodeResolve(nodeResolveOptions),
      commonjs(commonjsOptions),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: 'dist/esm',
          },
        },
      }),
      postcss(),
    ],
  },
];

export default rollupConfig;
