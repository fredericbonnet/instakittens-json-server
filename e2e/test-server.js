/*
 * Test server.
 */
const mockRequire = require('mock-require');
const url = require('url');

/**
 * Start the server
 *
 * - Loads the default DB in memory
 * - Mocks the accounts DB
 * - Starts the server on a random port
 *
 * @param {*} serverUrl URL of test server
 *
 * @return {db, accounts, router, listener, url}
 */
function start(serverUrl) {
  // Data source: load default DB in-memory.
  const source = require('../data/db')(true);

  // Mock accounts DB.
  const accounts = require('./test-accounts.json');
  mockRequire('../data/accounts.json', accounts);

  // Load & override server config.
  const config = require('../json-server.json');
  if (serverUrl) {
    // Use given port.
    config.port = url.parse(serverUrl).port;
  } else {
    // Choose random port.
    config.port = 0;
  }

  // (Re)start server.
  const { server, router } = require('../server.js')(source, config, {
    logger: false,
  });
  return new Promise(resolve => {
    const listener = server.listen(config.port, () => {
      const url = `http://localhost:${listener.address().port}`;
      console.log(`E2E test server listening on ${url}`);
      resolve({ db: source, accounts, router, listener, url });
    });
  });
}

module.exports = { start };
