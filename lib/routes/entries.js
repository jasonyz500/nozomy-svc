'use strict';

const Boom = require('boom');
const Joi = require('joi');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId; 
const _ = require('lodash');
const Entry = require('../models/entry');
const Tag = require('../models/tag');

const routesEntries = {
  name: 'routes-entries',
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/entries/{_id}',
      handler: async (request, h) => {
        const userId = request.auth.credentials.user_id;
        try {
          let res = await Entry.findOne({
            _id: request.params._id,
            user_id: userId
          });
          return res;
        } catch (e) {
          console.error(e);
          return Boom.badImplementation('Error reading data from database.');
        }
      },
      config: {
        auth: 'jwt',
        description: 'Get entry by id.'
      }
    });

    server.route({  
      method: 'GET',
      path: '/entries/all',
      handler: async (request, h) => {
        const userId = request.auth.credentials.user_id;
        try {
          let res = await Entry.find({
            user_id: userId
          }).sort({ date_string: 'desc', headline: 'asc' });
          return res;
        } catch (e) {
          console.error(e);
          return Boom.badImplementation('Error reading data from database.');
        }
      },
      config: {
        auth: 'jwt',
        description: 'Get all entries.'
      }
    });

    server.route({  
      method: 'GET',
      path: '/entries',
      handler: async (request, h) => {
        const { start_date, end_date } = request.query;
        try {
          let res = await Entry.find({
            date_string: {$gte: start_date, $lte: end_date}
          });
          return res;
        } catch (e) {
          console.error(e);
          return Boom.badImplementation('Error reading data from database.');
        }
      },
      config: {
        description: 'Get all entries between start and end dates.'
      }
    });

    server.route({
      method: ['PUT', 'PATCH'],
      path: '/entries/{_id}',
      handler: async (request, h) => {
        const p = request.payload;
        const userId = request.auth.credentials.user_id;
        try {
          let entry = await Entry.findOne({
            _id: request.params._id,
            user_id: userId
          });
          entry.date_string = p.date_string;
          if (p.headline != null) entry.headline = p.headline; // p.headline may be blank which is falsy
          if (p.body != null) entry.body = p.body; // p.body may be blank which is falsy
          entry.is_weekly = p.is_weekly;
          // handle delete tags
          let tagDiff = _.difference(entry.tags, p.tags);
          entry.tags = p.tags;
          // find or create tag in tags collection
          // todo: parallelize tags
          // _.each(p.tags, async (tag) => {
          //   let tagObj = await Tag.findOne({ user_id: userId, tag: tag }) || new Tag({user_id: userId, tag: tag});
          //   tagObj.last_used = moment();
          //   tagObj.entries[entry._id] = true;
          //   console.log(tagObj);
          //   let r = await tagObj.save();
          // });
          // delete leftover tags
          entry.last_save_time = moment().valueOf();
          let res = await entry.save();
          return res;
        } catch (e) {
          console.error(e);
          return Boom.badImplementation('Error communicating with db.');
        }
      },
      config: {
        auth: 'jwt',
        description: 'Update a single entry.'
      }
    });

    server.route({
      method: ['POST'],
      path: '/entries/new',
      handler: async (request, h) => {
        let entry = new Entry(request.payload);
        const userId = request.auth.credentials.user_id;
        entry.user_id = userId;
        entry.last_save_time = moment().valueOf();
        try {
          let res = await entry.save();
          return res._id;
        } catch (e) {
          console.error(e);
          return Boom.badImplementation('Error saving data to database.');
        }
      },
      config: {
        auth: 'jwt',
        description: 'Create a new entry.'
      }
    });

    server.route({
      method: 'DELETE',
      path: '/entries/{_id}',
      handler: async (request, h) => {
        const userId = request.auth.credentials.user_id;
        try {
          let res = await Entry.findOneAndRemove({
            _id: request.params._id,
            user_id: userId
          });
          return res._id;
        } catch (e) {
          console.error(e);
          return Boom.badImplementation('Error saving data to database.');
        }
      },
      config: {
        auth: 'jwt',
        description: 'Delete an entry by id.'
      }
    });

    server.route({
      method: 'POST',
      path: '/entries/tags',
      handler: async (request, h) => {

      },
      config: {
        auth: 'jwt',
        description: 'Get all entries matching a tag.'
      }
    });
  }
};

module.exports = routesEntries;