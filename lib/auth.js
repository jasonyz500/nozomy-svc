'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const jwt = require('hapi-auth-jwt2');
const jsonwebtoken = require('jsonwebtoken');
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
          return Boom.unauthorized('Email or Password invalid');
        }
        const loginSuccess = await bcrypt.compare(credentials.password, user.password);
        if (!loginSuccess) {
          return Boom.unauthorized('Email or Password invalid');
        }
        return signToken(user);
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