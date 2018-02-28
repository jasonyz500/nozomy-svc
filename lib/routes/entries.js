'use strict';

const Boom = require('boom');
const Joi = require('joi');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId; 
const _ = require('lodash');
const Entry = require('../models/entry');
const Tag = require('../models/tag');

exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/entries/{_id}',
    handler: async (request, reply) => {
      const userId = request.auth.credentials.user_id;
      try {
        let res = await Entry.find({
          _id: request.params._id,
          user_id: userId
        });
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
      const userId = request.auth.credentials.user_id;
      try {
        let res = await Entry.find({
          user_id: userId
        });
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
    method: ['PUT', 'PATCH'],
    path: '/entries/{_id}',
    handler: async (request, reply) => {
      const p = request.payload;
      const userId = request.auth.credentials.user_id;

      try {
        let entry = await Entry.find({
          _id: request.params._id,
          user_id: userId
        });
        entry.date_string = p.date_string;
        if (p.headline != null) entry.headline = p.headline; // p.headline may be blank which is falsy
        if (p.body != null) entry.body = p.body; // p.body may be blank which is falsy
        if (p.tags) {
          entry.tags = p.tags;
          // find or create tag in tags collection
          // try {
          //   let tag = await Tag.find()
          // } catch (e) {
          //   console.error(e);
          //   reply(Boom.badImplementation('Error updating tags in db.'));
          // }
        }
        let res = await entry.save();
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error fetching entry from db.'));
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
      const userId = request.auth.credentials.user_id;
      entry.user_id = userId
      try {
        let res = await entry.save();
        reply(res._id);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error saving data to database.'));
      }
    },
    config: {
      description: 'Create a new entry.'
    }
  });

  server.route({
    method: 'DELETE',
    path: '/entries/{_id}',
    handler: async (request, reply) => {
      const userId = request.auth.credentials.user_id;
      try {
        let res = await Entry.findOneAndRemove({
          _id: request.params._id,
          user_id: userId
        });
        reply(res._id);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error saving data to database.'));
      }
    },
    config: {
      description: 'Delete an entry by id.'
    }
  });

  // server.route({  
  //   method: 'GET',
  //   path: '/entries',
  //   handler: async (request, reply) => {
  //     const { start_date, end_date } = request.query;
  //     try {
  //       let res = await Entry.find({week_string: {$gte: start_date, $lte: end_date}});
  //       return reply(res);
  //     } catch (e) {
  //       console.error(e);
  //       reply(Boom.badImplementation('Error reading data from database.'))
  //     }
  //   },
  //   config: {
  //     description: 'Get all entries matching criteria.'
  //   }
  // });

  server.route({
    method: 'POST',
    path: '/entries/tags',
    handler: async (request, reply) => {

    },
    config: {
      description: 'Get all entries matching a tag.'
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-entries'
};