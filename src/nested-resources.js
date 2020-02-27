/*
 * Nested resources middleware.
 *
 * Enforces resource relationships by forcing the parent ID in child resources.
 *
 * @return Middleware function (here an express router)
 */
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

for (let parent of [
  { collection: 'users', key: 'user_id' },
  { collection: 'albums', key: 'album_id' },
  { collection: 'photos', key: 'photo_id' },
]) {
  router
    .route(`*/${parent.collection}/:parentId/:children`)
    .post((req, res, next) => {
      const { parentId, children } = req.params;
      req.body[parent.key] = parseInt(parentId);
      req.url = `/${children}`;
      next();
    });
  router
    .route(`*/${parent.collection}/:parentId/:children/:childId`)
    .put((req, res, next) => {
      const { parentId, children, childId } = req.params;
      req.body[parent.key] = parseInt(parentId);
      req.url = `/${children}/${childId}`;
      next();
    })
    .patch((req, res, next) => {
      const { parentId, children, childId } = req.params;
      req.body[parent.key] = parseInt(parentId);
      req.url = `/${children}/${childId}`;
      next();
    });
}

module.exports = router;
