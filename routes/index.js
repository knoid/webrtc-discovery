const routes = {};

routes.answer = require('./answer');
routes.feed = require('./feed');
routes.iceCandidate = require('./ice-candidate');
routes.offer = require('./offer');
routes.register = require('./register');

module.exports = routes;
