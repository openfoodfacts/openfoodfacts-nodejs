const OFF = require('../main')

const OFFAPI = new OFF()

OFFAPI.country('india').getBrands().then(brands => {
  console.info(brands)
}).catch(error => console.error(error))

OFFAPI.getProduct(7622210288257).then(product => {
  console.info(product)
}).catch(error => console.error(error))

OFFAPI.getBrand('monoprix').then(brand => {
  console.info(brand)
}).catch(error => console.error(error))

OFFAPI.getLanguages().then(languages => {
  console.info(languages)
}).catch(error => console.error(error))

OFFAPI.getLabels().then(labels => {
  console.info(labels)
}).catch(error => console.error(error))

OFFAPI.getProductsByBarcodeBeginning('3596710').then(products => {
  console.info(products)
}).catch(error => console.error(error))
