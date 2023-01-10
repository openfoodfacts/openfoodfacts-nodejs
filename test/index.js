const { describe, it } = require('mocha')
const { expect } = require('chai')
const fs = require('fs')
const mockery = require('mockery')
const path = require('path')

let lastCalledUrl = ''

const test = async (withAPI, url) => {
  expect(lastCalledUrl).to.equal(url)
  const request = require('request-promise')
  const withRequest = JSON.parse(await request(url))
  expect(withAPI).to.deep.equal(withRequest)
}

const mockRequest = (filename) => {
  mockery.registerMock('request-promise', function (url) {
    lastCalledUrl = url
    const response = fs.readFileSync(path.join(__dirname, 'mockdata', filename), 'utf8')
    return Promise.resolve(response.trim())
  })
}

const getOFFInstance = () => {
  const OFF = require('../main')
  return new OFF()
}

const worldURL = 'https://world.openfoodfacts.org'

describe('country', function () {
  this.timeout(30000)
  beforeEach((done) => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
    done()
  })
  it('Should fetch brands from India', async () => {
    mockRequest('in-brands.json')
    const indiaOFF = getOFFInstance().country('in')
    const withAPI = await indiaOFF.getBrands()
    await test(withAPI, 'https://in.openfoodfacts.org/brands.json')
  })
  it('Should fetch brands from Spain', async () => {
    mockRequest('es-brands.json')
    const spainOFF = getOFFInstance().country('es')
    const withAPI = await spainOFF.getBrands()
    await test(withAPI, 'https://es.openfoodfacts.org/brands.json')
  })
  it('Should fetch product with barcode', async () => {
    mockRequest('product-7622210288257.json')
    const barcode = '7622210288257'
    const withAPI = await getOFFInstance().getProduct(barcode)
    await test(withAPI, `${worldURL}/api/v0/product/${barcode}.json`)
  })
  it('Should fetch a brand by its name', async () => {
    mockRequest('brand-monoprix.json')
    const brand = 'monoprix'
    const withAPI = await getOFFInstance().getBrand(brand)
    await test(withAPI, `${worldURL}/brand/${brand}.json`)
  })
  it('Should fetch all languages', async () => {
    mockRequest('languages.json')
    const withAPI = await getOFFInstance().getLanguages()
    await test(withAPI, `${worldURL}/languages.json`)
  })
  it('Should fetch all labels', async () => {
    mockRequest('labels.json')
    const withAPI = await getOFFInstance().getLabels()
    await test(withAPI, `${worldURL}/labels.json`)
  })
  it('Should fetch product by barcode beginning', async () => {
    mockRequest('code-3596710xxxxxx.json')
    const beginning = '3596710'
    const withAPI = await getOFFInstance().getProductsByBarcodeBeginning(beginning)
    await test(withAPI, `${worldURL}/code/${beginning}xxxxxx.json`)
  })
  it('Should fetch all additives', async () => {
    mockRequest('additives.json')
    const withAPI = await getOFFInstance().getAdditives()
    await test(withAPI, `${worldURL}/additives.json`)
  })
  it('Should fetch all allergens', async () => {
    mockRequest('allergens.json')
    const withAPI = await getOFFInstance().getAllergens()
    await test(withAPI, `${worldURL}/allergens.json`)
  })
  it('Should fetch all categories', async () => {
    mockRequest('categories.json')
    const withAPI = await getOFFInstance().getCategories()
    await test(withAPI, `${worldURL}/categories.json`)
  })
  it('Should fetch all countries', async () => {
    mockRequest('countries.json')
    const withAPI = await getOFFInstance().getCountries()
    await test(withAPI, `${worldURL}/countries.json`)
  })
  it('Should fetch all entry dates', async () => {
    mockRequest('entry-dates.json')
    const withAPI = await getOFFInstance().getEntryDates()
    await test(withAPI, `${worldURL}/entry-dates.json`)
  })
  it('Should fetch all ingredients', async () => {
    mockRequest('ingredients.json')
    const withAPI = await getOFFInstance().getIngredients()
    await test(withAPI, `${worldURL}/ingredients.json`)
  })
  it('Should fetch all packagings', async () => {
    mockRequest('packaging.json')
    const withAPI = await getOFFInstance().getPackagings()
    await test(withAPI, `${worldURL}/packaging.json`)
  })
  it('Should fetch all packager codes', async () => {
    mockRequest('packager-codes.json')
    const withAPI = await getOFFInstance().getPacakgingCodes()
    await test(withAPI, `${worldURL}/packager-codes.json`)
  })
  it('Should fetch all purchase places', async () => {
    mockRequest('purchase-places.json')
    const withAPI = await getOFFInstance().getPurchasePlaces()
    await test(withAPI, `${worldURL}/purchase-places.json`)
  })
  it('Should fetch all states', async () => {
    mockRequest('states.json')
    const withAPI = await getOFFInstance().getStates()
    await test(withAPI, `${worldURL}/states.json`)
  })
  it('Should fetch all stores', async () => {
    mockRequest('stores.json')
    const withAPI = await getOFFInstance().getStores()
    await test(withAPI, `${worldURL}/stores.json`)
  })
  it('Should fetch all traces', async () => {
    mockRequest('traces.json')
    const withAPI = await getOFFInstance().getTraces()
    await test(withAPI, `${worldURL}/traces.json`)
  })
  afterEach((done) => {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
