const request = require('request-promise')

const defaultOptions = {
  country: 'world'
}

class OFF {
  constructor (options = defaultOptions) {
    this.options = options
    this.URL = `https://${options.country}.openfoodfacts.org`
  }

  setOption (option, value) {
    return new OFF({
      ...this.options,
      [option]: value
    })
  }

  country (country = defaultOptions.country) {
    return this.setOption('country', country)
  }

  getBrands () {
    return request(`${this.URL}/brands.json`)
      .then(JSON.parse)
  }

  getProduct (barcode) {
    return request(`${this.URL}/api/v0/${barcode}`)
      .then(JSON.parse)
  }

  getBrand (brandName) {
    return request(`${this.URL}/brand/${brandName}.json`)
      .then(JSON.parse)
  }

  getLanguages () {
    return request(`${this.URL}/languages.json`)
      .then(JSON.parse)
  }

  getLabels () {
    return request(`${this.URL}/labels.json`)
      .then(JSON.parse)
  }

  getProductsByBarcodeBeginning (beginning) {
    const fill = 'x'.repeat(13 - beginning.length)
    const barcode = beginning.concat(fill)
    return request(`${this.URL}/code/${barcode}.json`)
      .then(JSON.parse)
  }
}

module.exports = OFF
