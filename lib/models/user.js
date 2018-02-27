'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  last_login: Date
});

let User = mongoose.model('users', userSchema);

module.exports = User;