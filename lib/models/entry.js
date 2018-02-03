'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let schema = new Schema({
  user_id: String,
  is_weekly: Boolean,
  week_string: String,
  date_string: String,
  day_of_week_iso: { type: Number, min: 1, max: 7 },
  tags: Object,
  headline: String,
  body: String,
  last_save_time: Number
});

let Entry = mongoose.model('entries', schema);

module.exports = Entry;