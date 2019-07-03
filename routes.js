/*
 * This modules is used to apply custom routes at the end of the middleware chain.
 * By default json-server applies route rewriting rules before the other middlewares.
 * This can cause problems for e.g. access control middlewares.
 */
const jsonServer = require('json-server');
const express = require('express');

/**
 * Express router for /auth route, returns the auth info.
 */
const router = express.Router();
router
  .route(['/auth'])
  // Return auth info.
  .get((req, res, next) => {
    res.json(res.locals.auth);
  })
  // Reject everything else.
  .all((req, res, next) => res.sendStatus(405));

module.exports = [router, jsonServer.rewriter(require('./routes.json'))];
