'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let weekSchema = new Schema({
  user_id: String,
  week_string: String,
  daily_responses: Array,
  weekly_responses: Array
});

let Week = mongoose.model('weeks', weekSchema);

module.exports = Week;