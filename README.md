# React Wizard · [![https://img.shields.io/npm/v/@sebgroup/react-wizard](https://img.shields.io/npm/v/@sebgroup/react-wizard)](https://www.npmjs.com/package/@sebgroup/react-wizard) ![Build](https://github.com/sebgroup/react-wizard/workflows/Build/badge.svg) ![Deployment](https://github.com/sebgroup/react-wizard/workflows/Release/badge.svg) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Coverage Status](https://coveralls.io/repos/github/sebgroup/react-wizard/badge.svg?branch=master)](https://coveralls.io/github/sebgroup/react-wizard?branch=master)

This is a set of react wizard components some of which are based on SEB's bootstrap. The plan for this project is to increase and improve components for future usage.

- The package name: `@sebgroup/react-wizard`
- The package documentation: [Documentation](https://sebgroup.github.io/react-wizard)
- The package sourcecode: [Github Source Code](https://github.com/sebgroup/react-wizard)
- NPM package: [@sebgroup/react-wizard](https://www.npmjs.com/package/@sebgroup/react-wizard)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Minimum requirements

This version of components has been developed with:

- React
- Typescript
- SEB Bootstrap

## Installation

You should be able to install the NPM package.

```bash
npm install @sebgroup/react-wizard --save
```

This project is based on SEB Bootstrap and SEB React Components, to make sure everything works fine, please install these dependencies on your project:

```bash
npm install @sebgroup/bootstrap --save

npm install @sebgroup/react-components --save
```

Then make sure you add the Main SEB bootstrap package in your main style.SCSS or index.ts as follows
`@import '~@sebgroup/bootstrap/scss/bootstrap';`.

## Development

This project uses `prettier` for a more consistent (less annoying) coding. The `src` folder is where the actual components exist with all their necessary dependencies.

1. Installation `npm ci` or `npm i --force`
1. Development: `npm start`
1. Check formatting rules, Compile components: `npm run build:lib`
1. Build and create the Documentation pages only: `npm run build:docs`
1. To run the unit tests, run: `npm test`
1. To run a unit test for a specific component you have to pass the name of the component, example: `npm test Wizard`. It can also be chained with multiple specific components, e.g. `npm test Wizard WizardHeader`
1. To commit your changes run: `npm run commit` and follow the steps
