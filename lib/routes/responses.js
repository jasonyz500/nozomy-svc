'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const DailyResponse = require('../models/daily-response');
const WeeklyResponse = require('../models/weekly-response');

exports.register = function(server, options, next) {

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
    },
    config: {
      description: 'Get a single response'
    }
  });

  server.route({
    method: ['POST','PUT'],
    path: '/responses/{type}',
    handler: async (request, reply) => {
      let newResponse;
      switch (request.params.type) {
        case 'daily': 
          newResponse = new DailyResponse(request.payload);
          break;
        case 'weekly': 
          newResponse = new WeeklyResponse(request.payload);
          break;
        default: 
          return reply(Boom.badRequest('Bad response time level'));
      }
      try {
        let res = await newResponse.save();
        reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error saving data to database.'));
      }
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-responses'
};