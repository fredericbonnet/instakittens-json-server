/*
 * Cypress plugin initialization.
 */
const server = require('./test-server');

module.exports = (on, config) => {
  // Register tasks.
  on('task', {
    // Retrieve the DB object in the test context.
    db: () => global.db,
  });

  // Start the server then set Cypress' base URL to the server URL
  if (global.listener) global.listener.close();
  return server
    .start(config.baseUrl)
    .then(({ db, accounts, router, listener, url }) => {
      // Expose global objects.
      global.db = db;
      global.accounts = accounts;
      global.listener = listener;
      global.url = url;

      // Deactivate stale resource deletion for faster rollback.
      router.db._.mixin({ getRemovable: () => [] });

      // Return Cypress configuration object.
      return { baseUrl: url };
    });
};
