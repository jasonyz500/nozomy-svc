'use strict';

const env = process.env.NOZOMY_ENV || 'dev',
  config = require('./config.' + env);

module.exports = config
