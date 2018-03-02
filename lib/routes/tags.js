'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const moment = require('moment');
const _ = require('lodash');
const Tag = require('../models/tag');

exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/tags',
    handler: async (request, reply) => {
      const userId = request.auth.credentials.user_id;
      const { prefix } = request.query || '';
      try {
        const res = await Tag.find({ user_id: userId, tag: { $regex: new RegExp('^' + prefix) } })
                             .limit(6)
                             .sort('-last_used');
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      auth: 'jwt',
      description: 'Get tags by a user matching prefix.'
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-tags'
};