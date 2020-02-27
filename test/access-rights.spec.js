const chai = require('chai');
const { expect } = chai;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

/** Module to test. */
const accessRights = require('../src/access-rights.js');

/**
 * Utility proc to test resource access.
 *
 * @param url Resource URL
 * @param resource Resource value
 * @param auth Authentication info
 */
function request(url, resource, auth) {
  const db = {
    get: sinon.stub().returns({
      getById: sinon.stub().returns({
        value: sinon.stub().returns(resource),
      }),
    }),
  };
  const req = httpMocks.createRequest({ url });
  const res = httpMocks.createResponse();
  res.locals.auth = auth;
  const next = () => {};
  accessRights(db)(req, res, next);
  return res.statusCode;
}

describe('Access rights middleware', () => {
  it('should follow the Express middleware signature', () => {
    expect(accessRights({})).to.be.a.instanceOf(Function);
    expect(accessRights({}).length).to.equal(3);
  });

  describe('Public albums', () => {
    const album = {
      user_id: 1,
      type: 'PUBLIC',
    };
    const url = '/users/1/albums/2';

    it('should be accessible to anyone', () => {
      expect(request(url, album)).to.equal(200);
    });

    describe('Photos', () => {
      const url = '/users/1/albums/2/photos';
      expect(request(url, album)).to.equal(200);
    });
  });

  describe('Restricted albums', () => {
    const album = {
      user_id: 1,
      type: 'RESTRICTED',
    };
    const url = '/users/1/albums/2';

    it('should be denied to anonymous users', () => {
      expect(request(url, album)).to.equal(401);
    });
    it('should be accessible to registered users', () => {
      const auth = { userId: 1234 };
      expect(request(url, album, auth)).to.equal(200);
    });
    it('should be accessible to administrators', () => {
      const auth = { role: 'admin' };
      expect(request(url, album, auth)).to.equal(200);
    });

    describe('Photos', () => {
      const url = '/users/1/albums/2/photos';

      it('should be denied to anonymous users', () => {
        expect(request(url, album)).to.equal(401);
      });
      it('should be accessible to registered users', () => {
        const auth = { userId: 1234 };
        expect(request(url, album, auth)).to.equal(200);
      });
      it('should be accessible to administrators', () => {
        const auth = { role: 'admin' };
        expect(request(url, album, auth)).to.equal(200);
      });
    });
  });

  describe('Private albums', () => {
    const album = {
      user_id: 1,
      type: 'PRIVATE',
    };
    const url = '/users/1/albums/2';

    it('should be denied to anonymous users', () => {
      expect(request(url, album)).to.equal(401);
    });
    it('should be denied to registered users', () => {
      const auth = { userId: 1234 };
      expect(request(url, album, auth)).to.equal(403);
    });
    it('should be accessible to owner', () => {
      const auth = { userId: 1 };
      expect(request(url, album, auth)).to.equal(200);
    });
    it('should be accessible to administrators', () => {
      const auth = { role: 'admin' };
      expect(request(url, album, auth)).to.equal(200);
    });

    describe('Photos', () => {
      const url = '/users/1/albums/2/photos';

      it('should be denied to anonymous users', () => {
        expect(request(url, album)).to.equal(401);
      });
      it('should be denied to registered users', () => {
        const auth = { userId: 1234 };
        expect(request(url, album, auth)).to.equal(403);
      });
      it('should be accessible to owner', () => {
        const auth = { userId: 1 };
        expect(request(url, album, auth)).to.equal(200);
      });
      it('should be accessible to administrators', () => {
        const auth = { role: 'admin' };
        expect(request(url, album, auth)).to.equal(200);
      });
    });
  });
});
