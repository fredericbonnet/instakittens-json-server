const chai = require('chai');
const { expect } = chai;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

/** Module to test. */
const accessLevels = require('../src/access-levels.js');

/**
 * Utility proc to test accepted methods
 *
 * @param auth Authentication middleware
 * @param methods List of methods to test
 * @param request Request parameters
 */
function accept(auth, methods, request) {
  for (let method of methods) {
    const req = httpMocks.createRequest({ ...request, method });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    accessLevels(auth)(req, res, next);
    expect(res.statusCode).to.equal(200);
    expect(next).to.have.been.called;
  }
}

/**
 * Utility proc to test rejected methods
 *
 * @param auth Authentication middleware
 * @param methods List of methods to test
 * @param request Request parameters
 */
function reject(auth, methods, request) {
  for (let method of methods) {
    const req = httpMocks.createRequest({ ...request, method });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    accessLevels(auth)(req, res, next);
    expect(res.statusCode).to.satisfy(
      status => status === 401 || status === 403 || status === 405
    );
    expect(next).to.not.have.been.called;
  }
}

describe('Access level middleware', () => {
  it('should follow the Express middleware signature', () => {
    const auth = (req, res, next) => {
      next();
    };
    expect(accessLevels(auth)).to.be.a.instanceOf(Function);
    expect(accessLevels(auth).length).to.equal(3);
  });

  describe('Anonymous access', () => {
    // Arbitrary IDs.
    const userId = -1;
    const albumId = -2;
    const photoId = -3;
    const commentId = -4;

    // Authentication middleware.
    const auth = (req, res, next) => {
      // Unauthenticated
      res.sendStatus(401);
    };

    describe('Root', () => {
      it('should accept GET /', () => {
        accept(auth, ['GET'], {
          url: `/`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/`,
        });
      });
    });

    describe('Me', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /me', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/me`,
        });
      });
    });

    describe('Auth', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /auth', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/auth`,
        });
      });
    });

    describe('Users', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /users', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users`,
        });
      });
      it('should accept GET /users/:userId', () => {
        accept(auth, ['GET'], { url: `/users/${userId}` });
      });
      it('should reject POST/PUT/PATCH/DELETE /users/:userId', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users/${userId}`,
        });
      });

      describe('Subresources', () => {
        it('should accept GET /users/:userId/albums', () => {
          accept(auth, ['GET'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should reject POST/PUT/PATCH/DELETE /users/:userId/albums', () => {
          reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should accept GET /users/:userId/comment', () => {
          accept(auth, ['GET'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should reject POST/PUT/PATCH/DELETE /users/:userId/comments', () => {
          reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
      });
    });

    describe('Global albums', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /albums', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /albums/:albumId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums/${albumId}`,
        });
      });
    });

    describe('Global photos', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /photos', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /photos/:photoId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos/${photoId}`,
        });
      });
    });

    describe('Global comments', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /comments', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /comments/:commentId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments/${commentId}`,
        });
      });
    });
  });

  describe('User access', () => {
    // Arbitrary IDs.
    const userId = -1;
    const albumId = -2;
    const photoId = -3;
    const commentId = -4;

    // Authentication middleware.
    const auth = (req, res, next) => {
      // Authenticated as user.
      res.locals.auth = {
        userId: 1234,
        username: 'mockuser',
        password: 'mockpassword',
        role: 'user',
      };
      return next();
    };

    describe('Root', () => {
      it('should accept GET /', () => {
        accept(auth, ['GET'], {
          url: `/`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/`,
        });
      });
    });

    describe('Users', () => {
      it('should accept GET /users', () => {
        accept(auth, ['GET'], {
          url: `/users`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /users', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users`,
        });
      });
      it('should accept GET /users/:userId', () => {
        accept(auth, ['GET'], {
          url: `/users/${userId}`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /users/:userId', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users/${userId}`,
        });
      });

      describe('Subresources', () => {
        it('should accept GET /users/:userId/albums', () => {
          accept(auth, ['GET'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should reject POST/PUT/PATCH/DELETE /users/:userId/albums', () => {
          reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should accept GET /users/:userId/comment', () => {
          accept(auth, ['GET'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should reject POST/PUT/PATCH/DELETE /users/:userId/comments', () => {
          reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
      });
    });

    describe('Global albums', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /albums', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /albums/:albumId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums/${albumId}`,
        });
      });
    });

    describe('Global photos', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /photos', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /photos/:photoId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos/${photoId}`,
        });
      });
    });

    describe('Global comments', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /comments', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /comments/:commentId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments/${commentId}`,
        });
      });
    });
  });

  describe('Private access', () => {
    // Arbitrary IDs for all resources but user.
    const albumId = -2;
    const photoId = -3;
    const commentId = -4;

    const username = 'mockuser';
    const password = 'mockpassword';
    const userId = 1234;

    // Authentication middleware.
    const auth = (req, res, next) => {
      // Authenticated as user.
      res.locals.auth = {
        userId,
        username,
        password,
        role: 'user',
      };
      return next();
    };

    describe('Me', () => {
      it('should accept GET/POST/PUT/PATCH/DELETE /me', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/me`,
        });
      });

      describe('Subresources', () => {
        it('should accept GET/POST/PUT/PATCH/DELETE /me/albums', () => {
          accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/me/albums`,
          });
        });
        it('should accept GET/POST/PUT/PATCH/DELETE /me/comments', () => {
          accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/me/comments`,
          });
        });
      });
    });

    describe('Root', () => {
      it('should accept GET /', () => {
        accept(auth, ['GET'], {
          url: `/`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/`,
        });
      });
    });

    describe('Users', () => {
      it('should accept GET /users', () => {
        accept(auth, ['GET'], {
          url: `/users`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /users', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users`,
        });
      });
      it('should accept GET/POST/PUT/PATCH/DELETE /users/:userId', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users/${userId}`,
        });
      });

      describe('Subresources', () => {
        it('should accept GET/POST/PUT/PATCH/DELETE /users/:userId/albums', () => {
          accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should accept GET/POST/PUT/PATCH/DELETE /users/:userId/comments', () => {
          accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
      });
    });

    describe('Global albums', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /albums', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /albums/:albumId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums/${albumId}`,
        });
      });
    });

    describe('Global photos', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /photos', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /photos/:photoId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos/${photoId}`,
        });
      });
    });

    describe('Global comments', () => {
      it('should reject GET/POST/PUT/PATCH/DELETE /comments', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments`,
        });
      });
      it('should reject GET/POST/PUT/PATCH/DELETE /comments/:commentId', () => {
        reject(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments/${commentId}`,
        });
      });
    });
  });

  describe('Admin access', () => {
    // Arbitrary IDs.
    const userId = -1;
    const albumId = -2;
    const photoId = -3;
    const commentId = -4;

    // Authentication middleware.
    const auth = (req, res, next) => {
      // Authenticated as admin.
      res.locals.auth = {
        username: 'mockadmin',
        password: 'mockpassword',
        role: 'admin',
      };
      return next();
    };

    describe('Root', () => {
      it('should accept GET /', () => {
        accept(auth, ['GET'], {
          url: `/`,
        });
      });
      it('should reject POST/PUT/PATCH/DELETE /', () => {
        reject(auth, ['POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/`,
        });
      });
    });

    describe('Users', () => {
      it('should accept GET/POST/PUT/PATCH/DELETE /users', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users`,
        });
      });
      it('should accept GET/POST/PUT/PATCH/DELETE /users/:userId', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/users/${userId}`,
        });
      });

      describe('Subresources', () => {
        it('should accept GET/POST/PUT/PATCH/DELETE /users/:userId/albums', () => {
          accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
        it('should accept GET/POST/PUT/PATCH/DELETE /users/:userId/comments', () => {
          accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
            url: `/users/${userId}/albums`,
          });
        });
      });
    });

    describe('Global albums', () => {
      it('should accept GET/POST/PUT/PATCH/DELETE /albums', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums`,
        });
      });
      it('should accept GET/POST/PUT/PATCH/DELETE /albums/:albumId', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/albums/${albumId}`,
        });
      });
    });

    describe('Global photos', () => {
      it('should accept GET/POST/PUT/PATCH/DELETE /photos', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos`,
        });
      });
      it('should accept GET/POST/PUT/PATCH/DELETE /photos/:photoId', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/photos/${photoId}`,
        });
      });
    });

    describe('Global comments', () => {
      it('should accept GET/POST/PUT/PATCH/DELETE /comments', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments`,
        });
      });
      it('should accept GET/POST/PUT/PATCH/DELETE /comments/:commentId', () => {
        accept(auth, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
          url: `/comments/${commentId}`,
        });
      });
    });
  });
});
