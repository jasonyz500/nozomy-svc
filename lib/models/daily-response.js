'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let dailyResponseSchema = new Schema({
  user_id: String,
  date_string: String,
  day_of_week: Number,
  week_string: String,
  question: String,
  body:String,
  last_save_time: Date
});

let DailyResponse = mongoose.model('daily_responses', dailyResponseSchema);

module.exports = DailyResponse;