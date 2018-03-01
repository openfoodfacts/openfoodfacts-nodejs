const OFF = require('../main')

const worldOFF = new OFF()

const indiaOFF = worldOFF.country('in')
const frenchOFF = worldOFF.country('fr')

async function examples () {
  console.info((await indiaOFF.getBrands()).tags.length)
  console.info((await frenchOFF.getBrands()).tags.length)

  console.info(await worldOFF.getProduct(7622210288257))
  console.info(await worldOFF.getBrand('monoprix'))
  console.info(await worldOFF.getLanguages())
  console.info(await worldOFF.getLabels())
  console.info(await worldOFF.getProductsByBarcodeBeginning('3596710'))
}
try {
  examples().then(() => {
    console.info('Success')
  })
} catch (error) {
  console.error(error)
}
