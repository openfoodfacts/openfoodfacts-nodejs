# Changelog

## [2.0.0-alpha.13](https://github.com/openfoodfacts/openfoodfacts-js/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2025-08-24)


### ⚠ BREAKING CHANGES

* split v2 and v3, reorganize exports, use multiple returns ([#690](https://github.com/openfoodfacts/openfoodfacts-js/issues/690))

### Code Refactoring

* split v2 and v3, reorganize exports, use multiple returns ([#690](https://github.com/openfoodfacts/openfoodfacts-js/issues/690)) ([9c3b1d4](https://github.com/openfoodfacts/openfoodfacts-js/commit/9c3b1d4d5639256f1b2f1fc051349e06dc0b54b1))

## [2.0.0-alpha.12](https://github.com/openfoodfacts/openfoodfacts-js/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2025-08-20)


### Features

* **api:** add Facets Knowledge Panel API and Facets types ([db99d62](https://github.com/openfoodfacts/openfoodfacts-js/commit/db99d620391361884008d1e3548326c64a0471c4))
* **api:** add KnowledgePanel types and elements structure ([04b9199](https://github.com/openfoodfacts/openfoodfacts-js/commit/04b9199f649c73e8b8df6c911e8e6e95b4fbf447))
* **api:** add methods to fetch facet and facet values ([f35ed4d](https://github.com/openfoodfacts/openfoodfacts-js/commit/f35ed4da422f064f742fa489dfaec26c9301aad4))
* implement facet api ([402cf24](https://github.com/openfoodfacts/openfoodfacts-js/commit/402cf24fa3af848ea325411bf40f106fcfbcb366))


### Bug Fixes

* add language option to OpenFoodFactsOptions and constructor defaults ([a8d9c15](https://github.com/openfoodfacts/openfoodfacts-js/commit/a8d9c15a0114e16d5e3c8abf3d8c511b7e0b6f97))
* **test:** do not specify return type if not needed ([d28c691](https://github.com/openfoodfacts/openfoodfacts-js/commit/d28c691d27c134b6688072ba72df642eadab34b1))


### Miscellaneous Chores

* bump version to 2.0.0-alpha.12 ([3d64d4e](https://github.com/openfoodfacts/openfoodfacts-js/commit/3d64d4e65bb66727dafa5fd8fede73edc3292d9f))

## [2.0.0-alpha.11](https://github.com/openfoodfacts/openfoodfacts-js/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2025-08-12)


### Features

* implement image edit api ([#675](https://github.com/openfoodfacts/openfoodfacts-js/issues/675)) ([f86e0c8](https://github.com/openfoodfacts/openfoodfacts-js/commit/f86e0c88f1aa22dd32ce623c09db4ac04bb19f23))


### Miscellaneous Chores

* bump version to 2.0.0-alpha.11 ([0fe67be](https://github.com/openfoodfacts/openfoodfacts-js/commit/0fe67beab1527842e00a5537da088088fee9d973))

## [2.0.0-alpha.10](https://github.com/openfoodfacts/openfoodfacts-nodejs/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2025-08-02)


### Features

* add getAttributeGroups method ([9c0f72b](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/9c0f72b6647d3673ef0aa85a5523bd1e01ee3b51))
* api to get attribute-groups ([#669](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/669)) ([934030f](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/934030fb6031ec920958eeba57a5a37e67ecf616))
* moved products api to off.ts and added functions used in explorer ([#660](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/660)) ([1f654c6](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/1f654c60d1d0e4259979216cd88d04de75fde092))
* streamline api typing generation ([ffafc0a](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/ffafc0a270910788359d3e9aad4b97bb8f5bd5fd))


### Miscellaneous Chores

* bump version to 2.0.0-alpha.10 ([fef12ca](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/fef12cab2922e18d320de6cb4bb81ff518fa590b))

## [2.0.0-alpha.9](https://github.com/openfoodfacts/openfoodfacts-nodejs/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2025-07-18)


### Features

* add v3 API support and deprecate getProduct in favor of ([fb439f4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/fb439f43464fed00c3366445738e6163031435a0))
* Added API for fetching currencies list ([#653](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/653)) ([32e014c](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/32e014c14dda90a6f3f753fd4f9fa26342910ba1))


### Miscellaneous Chores

* release 2.0.0-alpha.9 ([a7826c8](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/a7826c8ed3f84b77637313c4309c43c48732c309))

## [2.0.0-alpha.8](https://github.com/openfoodfacts/openfoodfacts-nodejs/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2025-07-12)


### Features

* add getProductImageFolder method to return product image base URL ([#646](https://github.com/openfoodfacts/openfoodfacts-nodejs/issues/646)) ([7aa9da4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/7aa9da4ae0bc1e513ccfd991b407f6cb1e151c0f))
* refresh schemas to latest version & adapt (test) code ([7a52aa4](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/7a52aa44a71459381b58e22eba78444d900e935d))


### Bug Fixes

* remove $schemas path alias and update imports accordingly ([c7c7f9c](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/c7c7f9cad8e521dbb807ca361489af7f4c0c264d))
* remove externalv2 import from v2 schema ([5fce7e9](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/5fce7e9011812305aa13f5491e788218d466560e))


### Miscellaneous Chores

* bump version to 2.0.0-alpha.8 ([c342334](https://github.com/openfoodfacts/openfoodfacts-nodejs/commit/c34233447f8eac0faab0685b05b6dfb3c0deb847))

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
