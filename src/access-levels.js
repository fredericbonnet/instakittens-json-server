const express = require('express');

/**
 * Simple access level middleware.
 *
 * Protects some routes from unauthenticated access.
 *
 * @param auth Authentication middleware
 *
 * @return Middleware function (here an express router)
 */
module.exports = auth => {
  /**
   * Generic status sending error.
   */
  function sendStatus(status) {
    return (req, res, next) => {
      res.sendStatus(status);
    };
  }

  /**
   * Generic 403 Unauthorized error.
   */
  function unauthorized(req, res, next) {
    res.sendStatus(403);
  }

  /**
   * Allow anonymous access.
   */
  function allowAnonymous(req, res, next) {
    // Anonymous access.
    if (!req.get('authorization')) return next('route');
    next();
  }

  /**
   * Access restricted to registered users.
   */
  function allowUsers(req, res, next) {
    if (res.locals.auth && res.locals.auth.userId) return next('route');
    next();
  }

  /**
   * User-specific areas.
   */
  function requireUser(req, res, next) {
    if (
      res.locals.auth &&
      res.locals.auth.userId &&
      res.locals.auth.userId.toString() === req.params.userId
    ) {
      return next('route');
    }
    next();
  }

  /**
   * Admin can do anything.
   */
  function requireAdmin(req, res, next) {
    if (res.locals.auth && res.locals.auth.role === 'admin')
      return next('route');
    next();
  }

  /*
   *
   * Routes.
   *
   */

  const router = express.Router();

  /** Public area: accessible to anonymous and registered users */
  const publicArea = [allowAnonymous, auth, allowUsers];

  /** Restricted area: accessible to all registered users */
  const restrictedArea = [auth, allowUsers];

  /** Private area: restricted to owner */
  const privateArea = [auth, requireUser];

  /** Admin area: restricted to users with 'admin' role */
  const adminArea = [auth, requireAdmin];

  //
  // Root
  //

  router
    .route('/')
    // Everybody can view the root page.
    .get(publicArea)
    // Reject everything else.
    .all(sendStatus(405));

  //
  // Users
  //
  router
    .route('/users')
    // Only registered users can view global user list
    .get(restrictedArea)
    // Everything else requires admin level
    .all(adminArea, unauthorized);
  router
    .route(['/users/:userId', '/users/:userId/*'])
    // Everybody can access user data given its identifier
    .get(publicArea)
    // Users have total access on their own info
    .all(privateArea)
    // Everything else requires admin level
    .all(adminArea, unauthorized);

  //
  // Global album access
  //
  router
    .route(['/albums', '/albums/*'])
    // Global album access requires admin level
    .all(adminArea, unauthorized);

  //
  // Global photo access
  //
  router
    .route(['/photos', '/photos/*'])
    // Global photo access requires admin level
    .all(adminArea, unauthorized);

  //
  // Global comment access
  //
  router
    .route(['/comments', '/comments/*'])
    // Global comment access requires admin level
    .all(adminArea, unauthorized);

  //
  // Current user
  //

  // Convenience /me root for current user (excluding admin)
  router
    .route(['/me/', '/me/*'])
    // Rewrite route for registered users
    .all(auth, (req, res, next) => {
      if (res.locals.auth && res.locals.auth.userId) {
        req.url = req.url.replace(/^\/me/, `/users/${res.locals.auth.userId}`);
        return next('route');
      }
      next();
    })
    // Reject everything else.
    .all(sendStatus(404));

  // Auth info pass-through
  router.route(['/auth']).all(auth);

  return router;
};
