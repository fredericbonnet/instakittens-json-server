/*
 * Cucumber global hooks to start and stop the test server.
 */
const { AfterAll } = require('cucumber');
const server = require('../../e2e/test-server');

server.start().then(() => {
  // Deactivate stale resource deletion for faster rollback.
  global.router.db._.mixin({ getRemovable: () => [] });
});

AfterAll(function() {
  server.stop();
});
