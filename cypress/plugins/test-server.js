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
  const source = require('../../db')(true);

  // Mock accounts DB.
  const accounts = require('../fixtures/test-accounts.json');
  mockRequire('../../accounts.json', accounts);

  // Load & override server config.
  const config = require('../../json-server.json');
  if (serverUrl) {
    // Use given port.
    config.port = url.parse(serverUrl).port;
  } else {
    // Choose random port.
    config.port = 0;
  }
  mockRequire('../../json-server.json', config);

  // (Re)start server.
  const server = require('../../server.js');
  return server(source, { logger: false }).then(({ listener, router }) => {
    const url = `http://localhost:${listener.address().port}`;
    console.log(`E2E test server listening on ${url}`);

    return { db: source, accounts, router, listener, url };
  });
}

module.exports = { start };
