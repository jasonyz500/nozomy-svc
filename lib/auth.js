'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const jwt = require('hapi-auth-jwt2');
const jsonwebtoken = require('jsonwebtoken');
const User = require('./models/user');
const config = require('./config');

exports.register = (server, options, next) => {
  server.register(jwt, registerAuth);

  function registerAuth (err) {
    if (err) { return next(err); }

    server.auth.strategy('jwt', 'jwt', {
      key: config.jwtSecret,
      validateFunc: validate,
      verifyOptions: {algorithms: [ 'HS256' ]}
    });

    server.auth.default('jwt');

    return next();
  }

  function validate (decoded, request, cb) {
    User.findById(decoded.user_id, (err, user) => {
      if (user) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  }

  server.route({
    method: 'POST',
    path: '/login',
    handler: async (request, reply) => {
      const credentials = request.payload;
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        return reply(Boom.unauthorized('Email or Password invalid'));
      }
      const loginSuccess = await bcrypt.compare(credentials.password, user.password);
      if (!loginSuccess) {
        return reply(Boom.unauthorized('Email or Password invalid'));
      }
      return reply(signToken(user));
    },
    config: {auth: false}
  });
};

function signToken(user) {
  return jsonwebtoken.sign({
    user_id: user._id,
    email: user.email
  }, config.jwtSecret, {expiresIn: '144h'});
}

exports.register.attributes = {
  name: 'auth-jwt',
  version: '1.0.0'
};