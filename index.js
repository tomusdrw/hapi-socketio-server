'use strict'

const server = require('./server')


server
  .register({
    plugin: require('good'),
    options: {
      ops: {
        interval: 5000
      },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{log: '*', response: '*'}]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  })
  .then(() => server.start())
  .then(() => console.log(`Server running at ${server.info.uri}`))
  .catch(err => {
    throw err
  })
