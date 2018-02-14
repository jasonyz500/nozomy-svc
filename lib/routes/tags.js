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
      try {
        const { prefix } = request.query || '';
        const res = await .find();
        return reply(res);
      } catch (e) {
        console.error(e);
        reply(Boom.badImplementation('Error reading data from database.'))
      }
    },
    config: {
      description: 'Get tags by a user matching prefix.'
    }
  });

  return next();
};

exports.register.attributes = {  
  name: 'routes-tags'
};