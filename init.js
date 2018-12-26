/*
 * Server init script.
 */

/** Config file. */
const config = require('./json-server.json');

/** Command line arguments. */
const [, , ...args] = process.argv;
const fresh = args.includes('--fresh');

/** Data source. */
let source;
if (fresh) {
  // In-memory, fresh DB.
  source = require('./db')();
} else {
  // Persistent DB.
  source = './db.json';
}

/* Start server. */
const { server } = require('./server')(source, config);
const listener = server.listen(config.port, () => {
  const url = `http://localhost:${listener.address().port}`;
  console.log(`Server listening on ${url}`);
});
