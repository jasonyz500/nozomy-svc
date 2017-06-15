// 'use strict';

// let Mongoose = require('mongoose');  
// const config = require('./config');

// let mongoAuth = config.mongodb.user == '' ? '' : config.mongodb.user + ':' + config.mongodb.password + '@';
// let mongoLogin = 'mongodb://' + mongoAuth + config.mongodb.host + '/' + config.mongodb.database
// Mongoose.connect(mongoLogin);  
// let db = Mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error'));  
// db.once('open', function callback() {  
//     console.log("Connection with database succeeded.");
// });

// exports.Mongoose = Mongoose;  
// exports.db = db;

//----------

'use strict';

let Mongoose = require('mongoose');

exports.register = function (server, options, next) {

  let mongoAuth = options.user == '' ? '' : options.user + ':' + options.password + '@';
  let mongoLogin = 'mongodb://' + mongoAuth + options.host + '/' + options.db
  Mongoose.connect(mongoLogin);
  let db = Mongoose.connection;

  db.on('error', () => {
    console.log("Connection with mongodb failed");
  });
  db.once('open', () => {
    console.log("Connection with mongodb succeeded.");
  });

  server.mongodb = db;

  next();
};

exports.register.attributes = {
    name: 'mongodb',
    version: '1.0.0'
};