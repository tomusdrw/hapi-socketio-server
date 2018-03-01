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

const product = {
  name: Joi.string().alphanum().min(3).max(16).required(),
  description: Joi.string().min(10).max(256).required(),
  price: Joi.number().positive(),
  isSpecial: Joi.boolean()
}
server.route({
  method: 'POST',
  path: '/api/products',
  config: {
    validate: {
      payload: Joi.alternatives().try(product, { payload: product })
    },
    plugins: {
      'hapi-io': {
        event: 'action',
        mapping: {
          query: ['type'],
          payload: ['payload']
        }
      }
    }
  },
  handler (req, reply) {
    db.add(req.payload.payload || req.payload)
      .then(reply)
      .then(() => server.plugins['hapi-io'].io.emit('action', { type: 'PRODUCTS_CHANGED', payload: null }))
  }
})

server.route({
  method: 'DELETE',
  path: '/api/products/{payload}',
  config: {
    validate: {
      params: {
        payload: Joi.number().greater(6)
      }
    },
    plugins: {
      'hapi-io': {
        event: 'action',
        mapping: {
          param: ['payload']
        }
      }
    }
  },
  async handler (req, reply) {
    const removed = await db.remove(req.params.payload)
    if (!removed) {
      return reply(boom.notFound('Product does not exist.'))
    }

    server.plugins['hapi-io'].io.emit('action', { type: 'PRODUCTS_CHANGED', payload: null })
    return reply(removed)
  }
})
