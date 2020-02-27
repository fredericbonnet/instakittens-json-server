/*
 * Server init script.
 */
const express = require('express');

/* Express app. */
const app = express();

/** Config file. */
const config = require('./json-server.json');

/** Command line arguments. */
const [, , ...args] = process.argv;
const fresh = args.includes('--fresh');

/** Data source. */
let source;
if (fresh) {
  // In-memory, fresh DB.
  source = require('./data/db')();
} else {
  // Persistent DB.
  source = './data/db.json';
}

// Create the JSON server.
const { server, router } = require('./server')(source, config);

if (fresh) {
  // Fresh mode also activates the snapshots middleware.
  app.use('/snapshots', require('./snapshots')(router.db));
}

// Start the app.
app.use(server);
const listener = app.listen(config.port, () => {
  const url = `http://localhost:${listener.address().port}`;
  console.log(`Server listening on ${url}`);
});
