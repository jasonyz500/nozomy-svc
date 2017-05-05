'use strict';

const Hapi = require('hapi'),
  config = require('./config')

// Create a server with a host and port
const server = new Hapi.Server();  
server.connection({  
  host: 'localhost',
  port: 3000
});

// server.app.mongodb = require('./db').db;

server.route({  
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    return reply('Hello Hapi');
  }
});

server.register([  
  {
    register: require('./db'),
    options: config.mongodb 
  }, 
  { 
    register: require('./routes/responses')
  },
], (err) => {
  if (err) {
    throw err;
  }

  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });
});

module.exports = server;