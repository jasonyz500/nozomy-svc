'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const DefaultQuestions = require('../models/default-questions');

exports.register = function(server, options, next) {

  server.route({  
    method: 'GET',
    path: '/default-questions',
    handler: async (request, reply) => {
      try {
        let questions = await DefaultQuestions.find()[0];
        console.log(questions);
        reply(questions);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    }
  });

  // server.route({
  //   method: 'POST',
  //   path: '/default-questions/{type}',
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
  name: 'routes-default-questions'
};