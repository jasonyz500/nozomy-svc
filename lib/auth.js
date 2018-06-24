'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const jwt = require('hapi-auth-jwt2');
const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');
const User = require('./models/user');
const config = require('./config');

const validate = async function (decoded, request) {
  const user = await User.findById(decoded.user_id);
  if (user) {
    return { isValid: true };
  }
  return { isValid: false };
}

const authJwt = {
  name: 'auth-jwt',
  version: '1.0.0',
  register: async function (server, options) {
    await server.register(jwt);

    server.auth.strategy('jwt', 'jwt', {
      key: config.jwtSecret,
      validate: validate,
      verifyOptions: {algorithms: [ 'HS256' ]}
    });

    server.auth.default('jwt');

    server.route({
      method: 'POST',
      path: '/login',
      config: { auth: false },
      handler: async (request, h) => {
        const credentials = request.payload;
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return Boom.unauthorized('Email or Password invalid.');
        }
        const loginSuccess = await bcrypt.compare(credentials.password, user.password);
        if (!loginSuccess) {
          return Boom.unauthorized('Email or Password invalid.');
        }
        return signToken(user);
      }
    });

    server.route({
      method: 'POST',
      path: '/user/new',
      config: { auth: false },
      handler: async (request, h) => {
        const { email, password, whitelist } = request.payload;
        if (secret != config.whitelist) {
          return Boom.badRequest('You are not on whitelist!');
        }
        const user = await User.findOne({ email: email });
        if (user) {
          return Boom.badRequest('User already exists.');
        }
        try {
          const hash = await bcrypt.hash(password, 10);
          user = new User();
          user.email = email;
          user.password = hash;
          user.last_login = moment();
          const res = await user.save();
          return res;
        } catch (e) {
          return Boom.badImplementation('Failed to create new user');
        }
      }
    });
  }
};

function signToken(user) {
  return jsonwebtoken.sign({
    user_id: user._id,
    name: user.name
  }, config.jwtSecret, {expiresIn: '144h'});
}

module.exports = authJwt;