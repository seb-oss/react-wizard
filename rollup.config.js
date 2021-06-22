import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const input = ['src/index.ts'];
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};
const commonjsOptions = {};
const nodeResolveOptions = {
  extensions: ['.js', '.tsx', '.ts'],
};

const rollupConfig = [
  {
    input,
    output: {
      dir: 'dist/cjs',
      entryFileNames: '[name].js',
      esModule: true,
      exports: 'auto',
      format: 'cjs',
      globals,
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    external,
    plugins: [
      peerDepsExternal(),
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationDir: 'dist/cjs',
          },
        },
      }),
      postcss(),
      nodeResolve(nodeResolveOptions),
      commonjs(commonjsOptions),
    ],
  },
  {
    input,
    output: {
      dir: 'dist/esm',
      entryFileNames: '[name].js',
      esModule: true,
      exports: 'auto',
      format: 'esm',
      globals,
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    external,
    plugins: [
      peerDepsExternal(),
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationDir: 'dist/esm',
          },
        },
      }),
      postcss(),
      nodeResolve(nodeResolveOptions),
      commonjs(commonjsOptions),
    ],
  },
];

export default rollupConfig;
