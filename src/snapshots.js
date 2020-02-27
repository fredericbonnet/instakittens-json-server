const express = require('express');

/**
 * Simple data snapshots middleware.
 *
 * Saves/restores DB state, useful for testing.
 *
 * @param db JSON Server's lowdb store
 *
 * @return Middleware function (here an express router)
 */
module.exports = db => {
  const router = express.Router();

  // Save the initial DB state.
  let state = clone(db.getState());

  // Register save/restore routes.
  router.post('/save', (req, res) => {
    // Save the current DB state.
    state = clone(db.getState());
    res.send('OK');
  });
  router.post('/restore', (req, res) => {
    // Restore the saved DB state.
    db.setState(clone(state));
    res.send('OK');
  });

  return router;
};

/** Deep-clone an object using the JSON stringify/parse trick. */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
