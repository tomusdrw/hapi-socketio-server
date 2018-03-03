class Db {

  constructor () {
    this.products = require('./products.json')
  }

  async get () {
    return this.products
  }

  async add (product) {
    product.id = 1 + this.products
      .reduce((max, current) => max > current.id ? max : current.id, 0)
    product.img = `https://xpla.org/ext/lorempixel/250/250/technics/${product.id}`;
    this.products.push(product)
    return product
  }

  async remove (id) {
    const idx = this.products.map(p => p.id).indexOf(id)
    if (idx === -1) {
      return false
    }

    return this.products.splice(idx, 1)
  }
}


module.exports = new Db()
