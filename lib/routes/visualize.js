'use strict';

const Boom = require('boom');  
const Joi = require('joi');
const moment = require('moment');
const Entry = require('../models/entry');

exports.register = function(server, options, next) {

  return next();
};

exports.register.attributes = {  
  name: 'routes-visualize'
};