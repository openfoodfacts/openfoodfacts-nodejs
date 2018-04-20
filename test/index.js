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
    await test(withAPI, `${worldURL}/api/v0/${barcode}`)
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
})
