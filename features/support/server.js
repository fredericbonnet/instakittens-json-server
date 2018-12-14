/*
 * Cucumber global hooks to start and stop the test server.
 */
const { AfterAll } = require('cucumber');
const server = require('../../e2e/test-server');

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

AfterAll(function() {
  global.listener.close();
});
