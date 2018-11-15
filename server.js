/**
 * Server initialization.
 */
const jsonServer = require('json-server');

/** Config file. */
const config = require('./json-server.json');

/** Middlewares. */
const auth = require('./auth-basic');
const accessLevels = require('./access-levels.js');
const routes = require('./routes.js');

/**
 * Start server.
 *
 * @param {*} source Source DB (JSON file, JS module, object...)
 * @param {*} options JSON-Server options
 *
 * @returns Promise with the server listener
 */
module.exports = (source, options) => {
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
  server.use(routes);

  // Start server.
  server.use(router);

  return new Promise(resolve => {
    const listener = server.listen(config.port, () => {
      resolve(listener);
    });
  });
};
