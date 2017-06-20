'use strict';

const Boom = require('boom'),
  Joi = require('joi'),
  moment = require('moment'),
  _ = require('lodash');

const Week = require('../models/week');
const Response = require('../models/response');
const DefaultQuestions = require('../models/default-questions');

exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/week/{start_date}',
    handler: async (request, reply) => {
      let user_id = 1;
      let start_date = request.params.start_date;

      if (moment(start_date).day() != 1) {
        return reply(Boom.badRequest('Requested week start date is not Monday.'));
      }

      try {
        let week = await Week.findOne({user_id: user_id, week_string: start_date});
        if (!week) {
          return await create(request, reply);
        }
        let res = {
          week_string: start_date,
          daily_responses: [],
          weekly_responses: []
        };
        for (let day of week.daily_responses) {
          let dr = []
          for (let response_id of day) {
            dr.push(await Response.findById(response_id));
          }
          res.daily_responses.push(dr);
        }
        for (let response_id of week.weekly_responses) {
          res.weekly_responses.push(await Response.findById(response_id));
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

  let create = async function (request, reply) {
    try {
      let user_id = 1
      let start_date = request.params.start_date;

      if (moment(start_date).day() != 1) {
        return reply(Boom.badRequest('Requested week start date is not Monday.'));
      }
      if (await Week.findOne({user_id: user_id, week_string: start_date})) {
        return reply(Boom.badRequest('Week already exists'));
      }

      // set up return variables
      let res = {
        user_id: user_id,
        week_string: start_date,
        daily_responses: [],
        weekly_responses: []
      }
      let week = new Week(res);

      let defaults = await DefaultQuestions.findOne({user_id: user_id});
      // create responses and add their IDs to result obj
      for (let diff in _.range(7)) {
        week.daily_responses.push([]);
        res.daily_responses.push([]);
        for (let dq of defaults.default_daily) {
          let m = moment(start_date).add(diff, 'days');
          let dr = new Response({
            user_id: user_id,
            is_weekly: false,
            week_string: start_date,
            date_string: m.format('YYYY-MM-DD'),
            day_of_week: m.day(),
            question: dq
          });
          let s = await dr.save();
          week.daily_responses[diff].push(s._id);
          res.daily_responses[diff].push(s);
        }
      }
      for (let wq of defaults.default_weekly) {
        let wr = new Response({
          user_id: user_id,
          is_weekly: true,
          week_string: start_date,
          question: wq
        });
        let s = await wr.save();
        week.weekly_responses.push(s._id);
        res.weekly_responses.push(s);
      }
      await week.save();
      return reply(res);
    } catch (e) {
      console.error(e);
      reply(Boom.badImplementation('Error reading data from database.'));
    }
  }

  server.route({
    method: 'POST',
    path: '/week/{start_date}',
    handler: create,
    config: {
      description: 'Create a new week using default questions if not exists.'
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-week'
};