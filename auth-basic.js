/*
 * Simple Basic authentication middleware.
 *
 * Simply checks that the username/password are in accounts.json file. The
 * username is case insensitive.
 */

const base64 = require('base-64');

/** Accounts database */
const accounts = require('./data/accounts.json');

/**
 * Express middleware function.
 */
module.exports = function(req, res, next) {
  try {
    const authorization = req.get('Authorization');
    if (!authorization) throw 'unauthenticated';

    const [scheme, identity] = authorization.split(' ');
    if (!scheme || !identity || scheme.toLowerCase() !== 'basic')
      throw 'bad_scheme';

    const [, username, password] = base64
      .decode(identity)
      .match(/([^:]+):(.*)/);
    const account = accounts.find(
      account => account.username.toLowerCase() === username.toLowerCase()
    );
    if (!account || account.password !== password) throw 'authentication_error';

    // Remember auth info for further processing.
    res.locals.auth = Object.assign({}, account);

    return next();
  } catch (e) {
    return res
      .append(
        'WWW-Authenticate',
        'Basic realm="JSON-Server test"',
        'charset="UTF-8"'
      )
      .sendStatus(401);
  }
};
