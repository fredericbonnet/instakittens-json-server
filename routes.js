/*
 * This modules is used to apply custom routes at the end of the middleware chain. 
 * By default json-server applies route rewriting rules before the other middlewares.
 * This can cause problems for e.g. access control middlewares.
 */
const jsonServer = require('json-server');

module.exports = jsonServer.rewriter(require('./routes.json'));
