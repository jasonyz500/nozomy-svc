'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let tagSchema = new Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  tag: String,
  entries: Object,
  last_used: Date
});

let Tag = mongoose.model('tags', tagSchema);

module.exports = Tag;