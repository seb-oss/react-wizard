const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');
const dist = path.resolve(__dirname, '../dist');

const neededParams = [
  'name',
  'version',
  'description',
  'main',
  'typings',
  'repository',
  'publishConfig',
  'keywords',
  'author',
  'license',
  'bugs',
  'dependencies',
  'peerDependencies',
  'module',
  'exports',
];

Object.keys(pkg).forEach((param) => {
  if (!neededParams.includes(param)) {
    delete pkg[param];
  }
});

fs.writeFileSync(
  path.resolve(dist, 'package.json'),
  JSON.stringify(pkg, null, 4)
);
console.info('✅ Created package.json in dist folder');

fs.copyFileSync(
  path.resolve(root, 'README.md'),
  path.resolve(dist, 'README.md')
);
console.info('✅ Copied over README.md to dist');

fs.copyFileSync(path.resolve(root, 'LICENSE'), path.resolve(dist, 'LICENSE'));
console.info('✅ Copied over LICENSE to dist');
