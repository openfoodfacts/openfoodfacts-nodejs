# Open Food Facts - JS SDK

This is the official JS/TS SDK for the Open Food Facts API.

## Installation

### Development version

```shell
npm install git+https://github.com/openfoodfacts/openfoodfacts-nodejs.git
# or
yarn add git+https://github.com/openfoodfacts/openfoodfacts-nodejs.git
# or
pnpm add git+https://github.com/openfoodfacts/openfoodfacts-nodejs.git
```

#### Example code snippet:

```ts
import OpenFoodFacts from "openfoodfacts-nodejs";

const client = new OpenFoodFacts();
client.getProduct("5000112546415").then((it) => console.log(it));
```

## Development

### Prerequisites

- Node.js
- Yarn v4

### API bindings

The project uses [openapi-typescript](https://github.com/drwpow/openapi-typescript) to generate the API bindings automatically from the OpenAPI specification.

To generate the API bindings, run `yarn api`.
The files are to be committed to the repository, so that the SDK can be used without having to download the specs every time.

### Building

- Clone the repository and run `yarn install` in the directory.
- Run `yarn build` to generate the OpenAPI bindings and build the project.
- Run `yarn test` to run the tests.

## Contribute

We accept contributions of any kind: new features, bug fixes, documentation improvements, etc.

You can also help us by reporting bugs, suggesting improvements or testing new features.

When submitting a PR, please use the [angular commit guideline](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

## Third party applications

If you use this SDK, feel free to open a PR to add your application in this list.
