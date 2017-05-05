const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const server = require('../lib/server.js');

lab.test('returns true when 1 + 1 equals 2', (done) => {
    Code.expect(1 + 1).to.equal(2);
    done();
});

lab.test('It will return Hello Hapi', (done) => {
  server.inject({
    method: 'GET',
    url: '/'
  }, (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.equal('Hello Hapi');
    done();
  });
});