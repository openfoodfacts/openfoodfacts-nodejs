# Open Food Facts-NodeJS

This is the official node module for Open Food Facts API.

## Installation

Use npm to include package in your project:

`npm i openfoodfacts-nodejs`

Example code snippet:

```javascript
const off = require('openfoodfacts-nodejs');
const client = new off();

client.getProduct('5000112546415').then(console.log);
```

## Development

Clone the repository and run `npm i` in the directory

## Contribute

Fork the repository and feel free to send a PR.

Please use the [angular commit guideline](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

## Third party applications

If you use this SDK, feel free to open a PR to add your application in this list.
