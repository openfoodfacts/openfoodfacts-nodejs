const request = require('request')

const API_URL = 'https://world.openfoodfacts.org/'

let OFF = {}

OFF.getProduct = barcode => {
  return new Promise((resolve, reject) => {
    request(`${API_URL}api/v0/product/${barcode}.json`, (err, response, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}

module.exports = OFF
