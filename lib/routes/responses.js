'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const DailyResponse = require('../models/daily-response');

exports.register = function(server, options, next) {

  const db = server.app.mongodb;

  server.route({  
    method: 'GET',
    path: '/responses',
    handler: async (request, reply) => {
      try {
        let daily = await DailyResponse.find();
        console.log(daily);
        reply(daily);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/responses/daily/new',
    handler: async (request, reply) => {
      let daily = new DailyResponse({question: 'test'});
      let res = await daily.save({question: 'test'})
      console.log(res);
      reply(res);
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-responses'
};