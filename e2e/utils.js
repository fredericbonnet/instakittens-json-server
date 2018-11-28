/*
 * Utilities.
 */
const base64 = require('base-64');

/**
 * Build Basic authentication header.
 *
 * @param username Username
 * @param password Password
 */
function buildHeader(username, password) {
  return 'basic ' + base64.encode(username + ':' + password);
}

/**
 * Pick random element in array.
 *
 * @param array Array to pick element from
 * @param condition Optional predicate
 */
function getRandomElement(array, condition) {
  let index = Math.floor(Math.random() * array.length);
  while (condition && !condition(array[index])) {
    index = (index + 1) % array.length;
  }
  return array[index];
}

/**
 * Get an account of the given role.
 *
 * @param role Account role (e.g. admin, user)
 */
function getAccount(role) {
  return global.accounts.find(account => account.role === role);
}

module.exports = {
  buildHeader,
  getRandomElement,
  getAccount,
};
