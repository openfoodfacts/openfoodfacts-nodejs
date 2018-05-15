const request = require('request-promise')
const { describe, it } = require('mocha')
const { expect } = require('chai')
const OFF = require('../main')

const OFFInstance = new OFF()

const test = async (withAPI, url) => {
  const withRequest = JSON.parse(await request(url))
  expect(withAPI).to.deep.equal(withRequest)
}

const worldURL = 'https://world.openfoodfacts.org'

describe('country', function () {
  this.timeout(30000)
  it('Should fetch brands from India', async () => {
    const indiaOFF = OFFInstance.country('in')
    const withAPI = await indiaOFF.getBrands()
    await test(withAPI, `https://in.openfoodfacts.org/brands.json`)
  })
  it('Should fetch brands from Spain', async () => {
    const spainOFF = OFFInstance.country('es')
    const withAPI = await spainOFF.getBrands()
    await test(withAPI, `https://es.openfoodfacts.org/brands.json`)
  })
  it(`Should fetch product with barcode`, async () => {
    const barcode = '7622210288257'
    const withAPI = await OFFInstance.getProduct(barcode)
    await test(withAPI, `${worldURL}/api/v0/product/${barcode}`)
  })
  it(`Should fetch a brand by its name`, async () => {
    const brand = 'monoprix'
    const withAPI = await OFFInstance.getBrand(brand)
    await test(withAPI, `${worldURL}/brand/${brand}.json`)
  })
  it(`Should fetch all languages`, async () => {
    const withAPI = await OFFInstance.getLanguages()
    await test(withAPI, `${worldURL}/languages.json`)
  })
  it(`Should fetch all labels`, async () => {
    const withAPI = await OFFInstance.getLabels()
    await test(withAPI, `${worldURL}/labels.json`)
  })
  it(`Should fetch product by barcode beginning`, async () => {
    const beginning = '3596710'
    const withAPI = await OFFInstance.getProductsByBarcodeBeginning(beginning)
    await test(withAPI, `${worldURL}/code/${beginning}xxxxxx.json`)
  })
  it('Should fetch all additives', async () => {
    const withAPI = await OFFInstance.getAdditives()
    await test(withAPI, `${worldURL}/additives.json`)
  })
  it('Should fetch all allergens', async () => {
    const withAPI = await OFFInstance.getAllergens()
    await test(withAPI, `${worldURL}/allergens.json`)
  })
  it('Should fetch all categories', async () => {
    const withAPI = await OFFInstance.getCategories()
    await test(withAPI, `${worldURL}/categories.json`)
  })
  it('Should fetch all countries', async () => {
    const withAPI = await OFFInstance.getCountries()
    await test(withAPI, `${worldURL}/countries.json`)
  })
  it('Should fetch all entry dates', async () => {
    const withAPI = await OFFInstance.getEntryDates()
    await test(withAPI, `${worldURL}/entry-dates.json`)
  })
  it('Should fetch all ingredients', async () => {
    const withAPI = await OFFInstance.getIngredients()
    await test(withAPI, `${worldURL}/ingredients.json`)
  })
  it('Should fetch all packagings', async () => {
    const withAPI = await OFFInstance.getPackagings()
    await test(withAPI, `${worldURL}/packaging.json`)
  })
  it('Should fetch all packager codes', async () => {
    const withAPI = await OFFInstance.getPacakgingCodes()
    await test(withAPI, `${worldURL}/packager-codes.json`)
  })
  it('Should fetch all purchase places', async () => {
    const withAPI = await OFFInstance.getPurchasePlaces()
    await test(withAPI, `${worldURL}/purchase-places.json`)
  })
  it('Should fetch all states', async () => {
    const withAPI = await OFFInstance.getStates()
    await test(withAPI, `${worldURL}/states.json`)
  })
  it('Should fetch all stores', async () => {
    const withAPI = await OFFInstance.getStores()
    await test(withAPI, `${worldURL}/stores.json`)
  })
  it('Should fetch all traces', async () => {
    const withAPI = await OFFInstance.getTraces()
    await test(withAPI, `${worldURL}/traces.json`)
  })
})
