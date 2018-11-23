const express = require('express');

/**
 * Access rights middleware.
 *
 * Enforces resource access rules.
 *
 * @param db JSON Server's lowdb store
 *
 * @return Middleware function (here an express router)
 */
module.exports = db => {
  const router = express.Router();

  router
    .route([
      '/users/:userId/albums/:albumId',
      '/users/:userId/albums/:albumId/*',
    ])
    .get((req, res, next) => {
      const { userId, albumId } = req.params;
      const { auth } = res.locals;
      if (
        auth &&
        (auth.role === 'admin' || auth.userId.toString() === userId)
      ) {
        // Allow access to owner and admin.
        return next();
      }

      const album = db
        .get('albums')
        .getById(albumId)
        .value();
      if (!album) {
        // Not found.
        return res.sendStatus(404);
      }
      switch (album.type) {
        case 'PUBLIC':
          // Allow access to everybody.
          return next();
        case 'RESTRICTED':
          // Allow access to registered users.
          if (auth) return next();
      }

      // Deny access.
      res.sendStatus(auth ? 403 : 401);
    });

  return router;
};
