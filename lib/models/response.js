'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let responseSchema = new Schema({
  user_id: String,
  is_weekly: Boolean,
  week_string: String,
  date_string: String,
  day_of_week: Number,
  question: String,
  body:String,
  last_save_time: Number
});

let Response = mongoose.model('responses', responseSchema);

module.exports = Response;