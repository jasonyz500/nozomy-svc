'use strict';

const Hapi = require('hapi'),
  Blipp = require('blipp'),
  config = require('./config')

// Create a server with a host and port
const server = new Hapi.Server();  
server.connection({  
  host: 'localhost',
  port: 3000,
  routes: { cors: {"headers": ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language"]}}
});

// server.app.mongodb = require('./db').db;

server.register([  
  { register: Blipp, options: {} },
  {
    register: require('./db'),
    options: config.mongodb 
  },
  {
    register: require('./auth')
  },
  { 
    register: require('./routes/entries')
  }
], (err) => {
  if (err) {
    throw err;
  }

  server.route({  
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      console.log(request.auth.credentials);
      return reply('Hello Hapi');
    },
    config: {auth: 'jwt'}
  });

  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });
});

module.exports = server;