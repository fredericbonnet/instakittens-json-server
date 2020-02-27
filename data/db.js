/**
 * This module is used to serve the main DB in non-persistent mode (= in-memory).
 */
const fs = require('fs');
const path = require('path');

module.exports = fresh => {
  if (fresh) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  } else {
    return require('./db.json');
  }
};
