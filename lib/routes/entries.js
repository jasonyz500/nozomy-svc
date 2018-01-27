'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const moment = require('moment');
const _ = require('lodash');
const Entry = require('../models/entry');

exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/entries/{_id}',
    handler: async (request, reply) => {
      try {
        let res = await Entry.findById(request.params._id);
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get entry by id.'
    }
  });

  server.route({  
    method: 'GET',
    path: '/entries/all',
    handler: async (request, reply) => {
      try {
        let res = await Entry.find();
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get all entries.'
    }
  });

  server.route({  
    method: 'GET',
    path: '/entries',
    handler: async (request, reply) => {
      const { start_date, end_date } = request.query;
      try {
        let res = await Entry.find({week_string: {$gte: start_date, $lte: end_date}});
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get all entries matching criteria.'
    }
  });

  server.route({  
    method: 'GET',
    path: '/entries/week/{week_string}',
    handler: async (request, reply) => {
      const { week_string } = request.params;
      if (moment(week_string).day() != 1) {
        return reply(Boom.badRequest('Requested week start date is not Monday.'));
      }
      try {
        const entries = await Entry.find({week_string: week_string});
        return reply({
          entries: entries,
          week_string: week_string
        });
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get entries for the specified week string.'
    }
  });

  server.route({
    method: ['PUT', 'PATCH'],
    path: '/entries/{_id}',
    handler: async (request, reply) => {
      try {
        let p = request.payload;
        let entry = await Entry.findById(request.params._id);
        if (p.headline != null) entry.headline = p.headline; // p.headline may be blank which is falsy
        if (p.body != null) entry.body = p.body; // p.body may be blank which is falsy
        if (p.tags) entry.tags = p.tags;
        entry.last_save_time = p.last_save_time || moment().unix();
        let res = await entry.save();
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error communicating with database.'));
      }
    },
    config: {
      description: 'Update a single entry.'
    }
  });

  server.route({
    method: ['POST'],
    path: '/entries/new',
    handler: async (request, reply) => {
      let entry = new Entry(request.payload);
      try {
        let res = await entry.save();
        reply(res._id);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error saving data to database.'));
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/entries/{_id}',
    handler: async (request, reply) => {
      try {
        let res = await Entry.findByIdAndRemove(request.params._id);
        reply(res._id);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error saving data to database.'));
      }
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-entries'
};