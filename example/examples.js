const OFF = require('../main')

const OFFAPI = new OFF()

OFFAPI.country('india').getBrands().then(brands => {
  console.info(brands)
}).catch(error => console.error(error))

OFFAPI.getProduct(7622210288257).then(product => {
  console.info(product)
}).catch(error => console.error(error))
