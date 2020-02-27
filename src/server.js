/**
 * Server initialization.
 */
const jsonServer = require('json-server');

/** Middlewares. */
const auth = require('./auth-basic');
const accessLevels = require('./access-levels.js');
const accessRights = require('./access-rights.js');
const nestedResources = require('./nested-resources.js');
const routes = require('./routes.js');

/**
 * Start server.
 *
 * @param {*} source Source DB (JSON file, JS module, object...)
 * @param {*} config JSON-Server configuration
 * @param {*} options JSON-Server default options
 *
 * @returns the JSON server and router
 */
module.exports = (source, config, options) => {
  // Create server app.
  const server = jsonServer.create();

  // Create router.
  const router = jsonServer.router(source, config);
  // HACK HACK HACK replace JSON-server error handler
  router.stack[router.stack.length - 1].handle = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: err.message });
  };

  // Add default options and middlewares.
  server.use(jsonServer.defaults(options));

  // Add custom middlewares.
  server.use(accessLevels(auth));
  server.use(accessRights(router.db));
  server.use(nestedResources);
  server.use(routes);

  // Start server.
  server.use(router);
  return { server, router };
};
