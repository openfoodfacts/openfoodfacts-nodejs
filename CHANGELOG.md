# Changelog

## dev

## Features

## [2.0.0](https://github.com/openfoodfacts/openfoodfacts-nodejs/compare/v1.0.0...v2.0.0) (2024-10-13)


### ⚠ BREAKING CHANGES

* initial work for version 2.0.0

### Features

* add folksonomy and prices API ([00bfa2f](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/00bfa2f90d99f2828aa467188ae18168271a9a1f))
* add performOCR ([eeb37d4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/eeb37d44aaadd17df7ac7fbc3e5d6ee4b765be54))
* add robotoff openapi generation to package.json ([3d0a113](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/3d0a113a630ba8795a5cd8b9b8e74f0f3f0b5318))
* auto build & deploy documentation ([a66d3a8](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/a66d3a8b9f2dd7bfac060dbf5ba1d5461e4b14aa))
* initial work for version 2.0.0 ([2b488a3](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/2b488a36dc7bfb7326dfbb59b83e0393fd31f84b))


### Bug Fixes

* checkout submodules during nodejs workflow ([21e342e](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/21e342e472f071616db797662eead7801216f3dc))
* make docs job depend on build job ([b8dce91](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/b8dce914a664a93c115297efc66edf8b8eb7af0f))
* remove tests for now, as they are really difficult to implement with the new openapi codegen ([d5efade](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/d5efade6a74fe56307c8d278183cb3d3201bbab3))
* run doc generation only for latest node version ([e28547e](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/e28547ecec0f96370aa998e48d97d4e545f47a5e))
* use branch for server submodule. fixes type error ([19c730a](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/19c730ab353e4128caaa9fe48906eea3e163ebd3))

## 1.0.0 (2022-04-27)

### Features

- **additives:** add getAdditives function ([f8abf40](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/f8abf40e0f083a81624fcd4f875bb77c157071fe))
- **country:** OFF is now set to be immutable ([604edc3](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/604edc34a26ced68032687e21f8f0d05be6d6ade))
- **facets:** add functions for the rest of the OFF facets ([64c17f4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/64c17f43e942bbc3eaa70c5aac15003ac67354e3))
- **feature added:** more functions added in the package ([fd44462](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/fd44462d6d58d8e497eb3b031a63f5be6355b39d))

### Bug Fixes

- **additives:** remove useless line ([7944550](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/7944550e45ab50603c5e6db9e08ec88642f0fb6f))
- dependabot.yml syntax ([56c015d](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/56c015d61b6067f082072bbe9f021414b26d1b37))
- skip CodeQL for Dependabot on push events ([56fae76](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/56fae76222ef1d0f11b6013f147819910aae367d))
- tests for ci (npm ci) ([cf08b37](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/cf08b37beea9d7823c02e8b468b9c0308b17ebf9))
