'use strict';

const Boom = require('boom');

function wrapFunction(func) {
  try {
    func();
  } catch (e) {
    console.error(e);
    reply(Boom.badImplementation('Error saving data to database.'));
  }
}