const request = require('request-promise')

class OFF {
  constructor (options = {}) {
    this.options = options
    this.countryName = 'world'
    this.URL = 'https://world.openfoodfacts.org'
  }
  country (countryName) {
    this.countryName = countryName
    this.URL = `https://${this.countryName}.openfoodfacts.org`
    return this
  }

  getBrands () {
    const URL = this.URL
    this.URL = 'https://world.openfoodfacts.org'
    return request(`${URL}/brands.json`)
      .then(JSON.parse)
  }

  getProduct (barcode) {
    const URL = this.URL
    this.URL = 'https://world.openfoodfacts.org'
    return request(`${URL}/api/v0/${barcode}`)
      .then(JSON.parse)
  }

  getBrand (brandName) {
    const URL = this.URL
    this.URL = 'https://world.openfoodfacts.org'
    return request(`${URL}/brand/${brandName}.json`)
      .then(JSON.parse)
  }

  getLanguages () {
    const URL = this.URL
    this.URL = 'https://world.openfoodfacts.org'
    return request(`${URL}/languages.json`)
      .then(JSON.parse)
  }

  getLabels () {
    const URL = this.URL
    this.URL = 'https://world.openfoodfacts.org'
    return request(`${URL}/labels.json`)
      .then(JSON.parse)
  }

  getProductsByBarcodeBeginning (beginning) {
    const URL = this.URL
    this.URL = 'https://world.openfoodfacts.org'
    const fill = 'x'.repeat(13 - beginning.length)
    const barcode = beginning.concat(fill)
    return request(`${URL}/code/${barcode}.json`)
      .then(JSON.parse)
  }
}

module.exports = OFF
