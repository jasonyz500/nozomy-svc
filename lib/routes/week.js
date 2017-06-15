'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const moment = require('moment');
const Week = require('../models/week');
const DailyResponse = require('../models/daily-response');
const WeeklyResponse = require('../models/weekly-response');
const DefaultQuestions = require('../models/default-questions');

exports.register = function(server, options, next) {

  server.route({  
    method: 'GET',
    path: '/week/{start_date}',
    handler: async (request, reply) => {
      let start_date = request.params.start_date;

      if (moment(start_date).day() != 1) {
        return reply(Boom.badRequest('Requested week start date is not Monday.'));
      }

      try {
        let week = await Week.findOne({week_string: start_date});
        if (!week) {
          return reply(Boom.notFound('Week not yet created'));
        }

        let res = {
          daily_responses: [],
          weekly_responses: []
        };
        for (let day of week.daily_responses) {
          let dr = []
          for (let response_id of day) {
            dr.push(await DailyResponse.findById(response_id));
          }
          res.daily_responses.push(dr);
        }
        for (let response_id of week.weekly_responses) {
          res.weekly_responses.push(await WeeklyResponse.findById(response_id));
        }
        reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get complete posts for week with a given start date. Report if not found.'
    }
  });

  server.route({
    method: 'POST',
    path: '/week/{start_date}',
    handler: async (request, reply) => {
      try {
        let start_date = request.params.start_date;

        if (moment(start_date).day() != 1) {
          return reply(Boom.badRequest('Requested week start date is not Monday.'));
        }
        if (await Week.findOne({week_string: start_date})) {
          return reply(Boom.badRequest('Week already exists'));
        }

        let week = new Week();
        let defaults = await DefaultQuestions.findOne();
        console.log(defaults);
        return reply({});
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'));
      }
    },
    config: {
      description: 'Create a new week using default questions if not exists.'
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-week'
};