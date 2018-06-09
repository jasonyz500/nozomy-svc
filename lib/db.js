'use strict';

let Mongoose = require('mongoose');

const db = {
  name: 'mongodb',
  version: '1.0.0',
  register: async function (server, options) {
    let mongoAuth = options.user == '' ? '' : options.user + ':' + options.password + '@';
    let mongoLogin = 'mongodb://' + mongoAuth + options.host + '/' + options.db
    Mongoose.connect(mongoLogin);
    let db = Mongoose.connection;

    db.on('error', () => {
      console.log("Connection with mongodb failed");
      process.exit(1);
    });
    db.once('open', () => {
      console.log("Connection with mongodb succeeded.");
    });

    server.mongodb = db;
  }
};

module.exports = db;