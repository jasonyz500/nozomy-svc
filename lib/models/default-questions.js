'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let defaultQuestionsSchema = new Schema({
  user_id: String,
  default_daily: [String],
  default_weekly: [String],
  last_updated: Date
});

let DefaultQuestions = mongoose.model('default_questions', defaultQuestionsSchema);

module.exports = DefaultQuestions;