const server = require('./server');

server('./db.json').then(listener => {
  const url = `http://localhost:${listener.address().port}`;
  console.log(`Server listening on ${url}`);
});
