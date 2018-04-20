const request = require('request-promise')

const defaultOptions = {
  country: 'world'
}

/** Class OFF Node API Wrappper of OFF API */
class OFF {
  /**
   * Create OFF object
   * @param {Object} options - Options for the OFF Object
   * @param {string} options.country - Country for which you want to call OFF API Client
   */
  constructor (options = defaultOptions) {
    this.options = options
    this.URL = `https://${options.country}.openfoodfacts.org`
  }
  /**
   * It is used to set option in OFF instance
   * @return {Object} An OFF Instance with option set
   */
  setOption (option, value) {
    return new OFF({
      ...this.options,
      [option]: value
    })
  }
  /**
   * It is used to set country option in the OFF Instance
   * @param {string} country - Country value to set to the OFF Instance
   * @return {Object} An OFF Instance with the country option set
   * @example
   * const worldOFF = new OFF()
   * const indiaOFF = worldOFF.country('in')
   */
  country (country = defaultOptions.country) {
    return this.setOption('country', country)
  }

  /**
   * It is used to get all brands.
   * @return {Object} It returns a JSON containing all brands
   * @example
   * const worldOFF = new OFF()
   * const indiaOFF = worldOFF.country('in')
   * indiaOFF.getBrands().then(brands => {
   *   // use brands
   * })
   */
  getBrands () {
    return request(`${this.URL}/brands.json`)
      .then(JSON.parse)
  }

  /**
   * It is used to get a specific product using barcode
   * @param {number} barcode - Barcode of the product you want to fetch details
   * @return {Object} It returns a JSON of the product
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getProduct(7622210288257).then(product => {
   *   // use product
   * })
   */
  getProduct (barcode) {
    return request(`${this.URL}/api/v0/product/${barcode}.json`)
      .then(JSON.parse)
  }

  /**
   * It is used to get all details of a specific brand
   * @param {string} brandName - Brand name of the brand you want to fetch details
   * @return {Object} It returns a JSON with all details of the brand
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getBrand('monoprix').then(brand => {
   *   // use brand
   * })
   */
  getBrand (brandName) {
    return request(`${this.URL}/brand/${brandName}.json`)
      .then(JSON.parse)
  }

  /**
   * It is used to get all languages on the labels
   * @return {Object} It returns a JSON with list of all languages
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getLanguages().then(languages => {
   *   // use languages
   * })
   */
  getLanguages () {
    return request(`${this.URL}/languages.json`)
      .then(JSON.parse)
  }

  /**
   * It is used to get all Labels from the API
   * @return {Object} It returns a JSON with all labels present on the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getLabels().then(labels => {
   *   // use labels
   * })
   */
  getLabels () {
    return request(`${this.URL}/labels.json`)
      .then(JSON.parse)
  }

  /**
  * It is used to get all additives from the API
  * @return {Object} It returns a JSON with all additives present in the API
  * @example
  * const worldOFF = new OFF()
  * worldOFF.getAdditives().then(additives =>{
  *    //use additives
  * })
  */

  getAdditives () {
    return request(`${this.URL}/additives.json`)
      .then(JSON.parse)
  }

  /**
   * It is used to get all products beginning with the given barcode string
   * @param {string} beginning - Barcode string from which if the barcode begins, then product is to be fetched
   * @return {Object} It returns a JSON of all products that begin with the given barcode string
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getProductsByBarcodeBeginning('3596710').then(products => {
   *   // use products
   * })
   */
  getProductsByBarcodeBeginning (beginning) {
    const fill = 'x'.repeat(13 - beginning.length)
    const barcode = beginning.concat(fill)
    return request(`${this.URL}/code/${barcode}.json`)
      .then(JSON.parse)
  }
}

module.exports = OFF
