'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let weekSchema = new Schema({
  user_id: String,
  week_string: String,
  daily_entries: Object,
  weekly_entries: Array
});

let Week = mongoose.model('weeks', weekSchema);

module.exports = Week;