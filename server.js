const Hapi = require('hapi')
const Joi = require('joi')
const boom = require('boom')
const db = require('./db')

const server = new Hapi.Server({
  port: 8000,
  host: 'localhost'
})

module.exports = server

server.route({
  method: 'GET',
  path: '/api/products',
  handler (req, h) {
    return db.get()
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
    }
  },
  handler (req, h) {
    return db.add(req.payload)
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
    }
  },
  async handler (req, h) {
    const removed = await db.remove(req.params.id)
    if (!removed) {
      return boom.notFound('Product does not exist.')
    }

    return removed
  }
})
