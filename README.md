# Open Food Facts - JS SDK

This is the official JS/TS SDK for the Open Food Facts API.

## Installation

```shell
npm install openfoodfacts-nodejs
# or
yarn add openfoodfacts-nodejs
# or
pnpm add openfoodfacts-nodejs
```

#### Example code snippet:

```ts
import { OpenFoodFacts } from "openfoodfacts-nodejs";

 /** Optionnal options for client
 * @param fetch - fetcher to be used in the client | Default to openapi-fetch
 * @param country - country from where base url should point / Default to world
 */
const client = new OFF();

client.getProduct("5000112546415").then(console.log);
```

## Development

The project uses [openapi-typescript](https://github.com/drwpow/openapi-typescript) to generate the API bindings automatically from the OpenAPI specification.

The folder `server` is a submodule of the [Open Food Facts Server](https://github.com/openfoodfacts/openfoodfacts-server) repository.

### Prerequisites

- Node.js 14+
- Yarn v2

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
