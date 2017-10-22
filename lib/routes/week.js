'use strict';

const Boom = require('boom'),
  Joi = require('joi'),
  moment = require('moment'),
  _ = require('lodash');

const Week = require('../models/week');
const Entry = require('../models/entry');
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
          daily_entries: [],
          weekly_entries: []
        };
        for (let day of week.daily_entries) {
          let dr = []
          for (let entry_id of day) {
            dr.push(await Entry.findById(entry_id));
          }
          res.daily_entries.push(dr);
        }
        for (let entry_id of week.weekly_entries) {
          res.weekly_entries.push(await Entry.findById(entry_id));
        }
        reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get complete posts for week with a given start date. Create new if not found.'
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
        daily_entries: [],
        weekly_entries: []
      }
      let week = new Week(res);
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
      description: 'Create a new week if not exists.'
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-week'
};