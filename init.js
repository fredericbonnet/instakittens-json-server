/*
 * Server init script.
 */

const [, , ...args] = process.argv;

let source;
if (args.includes('--fresh')) {
  // In-memory, fresh DB.
  source = require('./db')();
} else {
  // Persistent DB.
  source = './db.json';
}

const server = require('./server');

server(source).then(listener => {
  const url = `http://localhost:${listener.address().port}`;
  console.log(`Server listening on ${url}`);
});
