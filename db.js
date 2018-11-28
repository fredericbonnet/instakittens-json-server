/**
 * This module is used to serve the main DB in non-persistent mode (= in-memory).
 */
const fs = require('fs');

module.exports = fresh => {
  if (fresh) {
    return JSON.parse(fs.readFileSync('./db.json'));
  } else {
    return require('./db.json');
  }
};
