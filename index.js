'use strict'

const server = require('./server')

const plugins = [
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
