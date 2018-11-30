/*
 * E2E test entry point.
 *
 * - Loads & stores the default DB in global.db
 * - Mocks & exposes the accounts DB in global.accounts
 * - Starts the server on a random port, and exposes its URL in global.url
 */
const mockRequire = require('mock-require');

// Data source: load default DB in-memory.
const source = require('../db')(true);
global.db = source;

// Mock accounts DB.
const accounts = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { userId: 1, username: 'user', password: 'user', role: 'user' },
];
mockRequire('../accounts.json', accounts);

// Expose accounts in global object.
global.accounts = accounts;

// Load & override server config.
const config = require('../json-server.json');
if (global.listener) {
  // Server is already running, reuse current port.
  config.port = global.listener.address().port;
} else {
  // Choose random port.
  config.port = 0;
}
mockRequire('../json-server.json', config);

// (Re)start server.
const server = require('../server.js');
if (global.listener) global.listener.close();
server(source, { logger: false }).then(({ listener, router }) => {
  global.listener = listener;
  global.router = router;

  const url = `http://localhost:${listener.address().port}`;
  console.log(`E2E test server listening on ${url}`);

  // Expose server URL in global object.
  global.url = url;
});
