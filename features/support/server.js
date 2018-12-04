/*
 * Cucumber global hooks to start and stop the test server.
 */
const { BeforeAll, AfterAll } = require('cucumber');
const server = require('../../e2e/test-server');

BeforeAll(async function() {
  await server.start();

  // Deactivate stale resource deletion for faster rollback.
  global.router.db._.mixin({ getRemovable: () => [] });
});
AfterAll(function() {
  server.stop();
});
