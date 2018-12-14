/*
 * E2E test entry point.
 *
 * Starts the test server.
 */
const server = require('./test-server');

if (global.listener) global.listener.close();
server.start(global.url).then(({ db, accounts, router, listener, url }) => {
  // Expose global objects.
  global.db = db;
  global.accounts = accounts;
  global.listener = listener;
  global.url = url;

  // Deactivate stale resource deletion for faster rollback.
  router.db._.mixin({ getRemovable: () => [] });
});
