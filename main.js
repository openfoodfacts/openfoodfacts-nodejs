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
    return request(`${URL}/brands.json`)
      .then(JSON.parse)
  }

  getProduct (barcode) {
    const URL = this.URL
    return request(`${URL}/api/v0/${barcode}`)
      .then(JSON.parse)
  }
}

module.exports = OFF
