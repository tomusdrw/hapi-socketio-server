'use strict'

const server = require('./server')

const plugins = [
  require('inert'),
  require('vision'),
  {
    register: require('hapi-swagger'),
    options: {
      info: {
        title: 'Shop API documentation',
        version: '1.0'
      }
    }
  },
  {
    register: require('good'),
    options: {
      ops: {
        interval: 5000
      },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{log: '*', response: '*', payload: '*'}]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  },
  {
    register: require('hapi-io'),
    options: {
    }
  }
]

server.register(plugins, () => {
  server.start(err => {
    if (err) {
      throw err
    }

    console.log(`Server running at ${server.info.uri}`)
  })
})
