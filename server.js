const Hapi = require('hapi')
const Joi = require('joi')
const boom = require('boom')
const db = require('./db')

const server = new Hapi.Server()

module.exports = server

server.connection({
  port: 8000,
  host: 'localhost'
})

server.route({
  method: 'GET',
  path: '/api/products',
  handler (req, reply) {
    db.get().then(reply)
  }
})

server.route({
  method: 'POST',
  path: '/api/products',
  config: {
    validate: {
      payload: {
        name: Joi.string().alphanum().min(3).max(16).required(),
        description: Joi.string().min(10).max(256).required(),
        price: Joi.number().positive(),
        isSpecial: Joi.boolean()
      },
      failAction (req, h, err) {
        throw err
      }
    },
    plugins: {
      'hapi-io': 'create-product'
    }
  },
  handler (req, reply) {
    db.add(req.payload)
      .then(reply)
      .then(server.plugins['hapi-io'].io.emit('products'))
  }
})

server.route({
  method: 'DELETE',
  path: '/api/products/{id}',
  config: {
    validate: {
      params: {
        id: Joi.number().greater(6)
      }
    },
    plugins: {
      'hapi-io': 'delete-product'
    }
  },
  async handler (req, reply) {
    const removed = await db.remove(req.params.id)
    if (!removed) {
      return reply(boom.notFound('Product does not exist.'))
    }

    server.plugins['hapi-io'].io.emit('products')
    return reply(removed)
  }
})
