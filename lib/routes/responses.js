'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const moment = require('moment');
const Response = require('../models/response');

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
    method: ['PUT', 'PATCH'],
    path: '/responses/{_id}',
    handler: async (request, reply) => {
      try {
        let p = request.payload;
        let resp = await Response.findById(request.params._id);
        if (resp.last_save_time && resp.last_save_time < p.last_save_time) {
          return reply({success: true, message: 'Requested autosave is older than existing model'});
        }
        if (p.question) resp.question = p.question;
        if (p.body != null) resp.body = p.body;
        resp.last_save_time = p.last_save_time || moment().unix();
        let res = await resp.save();
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error communicating with database.'));
      }
    },
    config: {
      description: 'Update a single response'
    }
  });

  // server.route({
  //   method: ['POST'],
  //   path: '/responses/{type}',
  //   handler: async (request, reply) => {
  //     let newResponse;
  //     switch (request.params.type) {
  //       case 'daily': 
  //         newResponse = new DailyResponse(request.payload);
  //         break;
  //       case 'weekly': 
  //         newResponse = new WeeklyResponse(request.payload);
  //         break;
  //       default: 
  //         return reply(Boom.badRequest('Bad response time level'));
  //     }
  //     try {
  //       let res = await newResponse.save();
  //       reply(res);
  //     } catch (e) {
  //       console.error(e);
  //       reply(Boom.badImplementation('Error saving data to database.'));
  //     }
  //   }
  // });

  return next();
};

exports.register.attributes = {  
  name: 'routes-responses'
};