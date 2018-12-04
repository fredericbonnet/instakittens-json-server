/*
 * E2E test entry point.
 *
 * Starts the test server.
 */
const server = require('./test-server');

server.start().then(() => {
  // Deactivate stale resource deletion for faster rollback.
  global.router.db._.mixin({ getRemovable: () => [] });
});
