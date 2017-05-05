'use strict';

const mongoose = require('mongoose'),
  Boom = require('boom'),
    _ = require('lodash');

const Schema = mongoose.Schema;

let dailyResponseSchema = new Schema({
  user_id: String,
  date_string: String,
  day_of_week: Number,
  week_string: String,
  question: String,
  body:String,
  last_updated: Date
});

let DailyResponse = mongoose.model('Response', dailyResponseSchema);

module.exports = DailyResponse;