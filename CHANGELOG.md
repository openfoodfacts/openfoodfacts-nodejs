# Changelog

## 1.0.0 (2025-05-07)


### ⚠ BREAKING CHANGES

* initial work for version 2.0.0

### Features

* Add endpoint for /insights robotoff ([#553](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/553)) ([475363b](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/475363b44f493a1829756e2dc87fa85ba958995a))
* add folksonomy and prices API ([00bfa2f](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/00bfa2f90d99f2828aa467188ae18168271a9a1f))
* add nutripatrol API interfaces and support all flag endpoints ([d29ffac](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/d29ffac5bc00c780cdfcd62e3ea51ae2d1b73c52))
* add performOCR ([eeb37d4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/eeb37d44aaadd17df7ac7fbc3e5d6ee4b765be54))
* add robotoff openapi generation to package.json ([3d0a113](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/3d0a113a630ba8795a5cd8b9b8e74f0f3f0b5318))
* add support for custom host in OpenFoodFacts constructor ([#611](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/611)) ([19efc0c](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/19efc0c5b6bdeaa4b44b06370931d441b59225ae))
* add support for the Search-A-Licious API ([#607](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/607)) ([a98db57](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/a98db57c573db7a95573506b5d92af8b95a97d11))
* add support for ticket in nutripatrol API ([d09ae9a](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/d09ae9ac44abac4e1a0c8a40c8e1540cfc20b2da))
* add USER_AGENT constant and include it in API request headers ([#559](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/559)) ([6052c45](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/6052c459f706e82f303cad31f052e307dcd98237))
* added error handling for Folksonomy Write APIs ([#623](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/623)) ([1cd83d9](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/1cd83d94d3f6f2fda24fe409b0ef1cd965f9ab7a))
* **additives:** add getAdditives function ([f8abf40](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/f8abf40e0f083a81624fcd4f875bb77c157071fe))
* auto build & deploy documentation ([a66d3a8](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/a66d3a8b9f2dd7bfac060dbf5ba1d5461e4b14aa))
* **brands:** add getBrands and country function ([e844700](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/e844700bb4ebd31479b79c9e55c71825ddcc2d6e))
* change `Content-Type` in `robotoff.ts` annotate method ([#599](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/599)) ([6be74ef](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/6be74eff7f8a084fc6de0a8c413a4606c04dcaed))
* **country:** OFF is now set to be immutable ([90e951a](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/90e951a4547d965b1521e59153fbe9507c3f053c))
* **country:** OFF is now set to be immutable ([604edc3](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/604edc34a26ced68032687e21f8f0d05be6d6ade))
* **facets:** add functions for the rest of the OFF facets ([64c17f4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/64c17f43e942bbc3eaa70c5aac15003ac67354e3))
* **feature added:** more functions added in the package ([220fd3f](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/220fd3f22dbc039bd7cb2ade8a61c79df815d0d7))
* **feature added:** more functions added in the package ([fd44462](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/fd44462d6d58d8e497eb3b031a63f5be6355b39d))
* initial work for version 2.0.0 ([2b488a3](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/2b488a36dc7bfb7326dfbb59b83e0393fd31f84b))
* integration of OBF, OPF and OPFF ([#616](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/616)) ([897598f](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/897598ff9f137fbdcb78f290bd7141da94b3d49c))
* Make authToken optional for folksonomy client ([#571](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/571)) ([5679099](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/56790997304bbde5c5862b985eea015c6e6cc630))
* make base url configurable for all APIs ([#624](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/624)) ([aea2b8f](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/aea2b8f8a8ab2ae7888735e32d262f37b8971c99))
* refactor error handling in nutripatrol wrapper ([eb94452](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/eb94452503d58f602f20fd947547476851fea36d))
* Typescript declaration files ([8ec0240](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/8ec02404d0d4d866631344c586a139f6623e0a7d))


### Bug Fixes

* add temporary type to loadLogo method to prevent TypeScript errors ([efb9fe5](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/efb9fe569980b2a325a9b42f07f6e74cee30023b))
* **additives:** remove useless line ([7944550](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/7944550e45ab50603c5e6db9e08ec88642f0fb6f))
* body stream already read error, add types ([#622](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/622)) ([56e14ec](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/56e14eca2e2d92e3035b028ca616c88a13cbfefb))
* checkout submodules during nodejs workflow ([21e342e](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/21e342e472f071616db797662eead7801216f3dc))
* dependabot.yml syntax ([56c015d](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/56c015d61b6067f082072bbe9f021414b26d1b37))
* export Search APIs in main.ts ([2663866](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/2663866002b1fca014db34c1f27062f7da52810a))
* login and isAuthenticated methods in OpenPrices client ([#620](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/620)) ([e3903ab](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/e3903abb334d19e3a16535564e923fdbca44cef9))
* make docs job depend on build job ([b8dce91](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/b8dce914a664a93c115297efc66edf8b8eb7af0f))
* remove tests for now, as they are really difficult to implement with the new openapi codegen ([d5efade](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/d5efade6a74fe56307c8d278183cb3d3201bbab3))
* run doc generation only for latest node version ([e28547e](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/e28547ecec0f96370aa998e48d97d4e545f47a5e))
* skip CodeQL for Dependabot on push events ([56fae76](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/56fae76222ef1d0f11b6013f147819910aae367d))
* tests for ci (npm ci) ([9a510f8](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/9a510f82d43a4d53cac1fcb89cdf892087d4a6bc))
* tests for ci (npm ci) ([cf08b37](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/cf08b37beea9d7823c02e8b468b9c0308b17ebf9))
* **ts:** wrong [@ts-ignore](https://github.com/ts-ignore) usage ([53ebeef](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/53ebeefb4498ed2850e1592920ba227c71a9c089))
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
