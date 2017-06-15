'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let weeklyResponseSchema = new Schema({
  user_id: String,
  week_string: String,
  question: String,
  body:String,
  last_save_time: Date
});

let WeeklyResponse = mongoose.model('weekly_responses', weeklyResponseSchema);

module.exports = WeeklyResponse;