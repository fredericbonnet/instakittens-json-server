const chai = require('chai');
const { expect } = chai;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const mockRequire = require('mock-require');
const base64 = require('base-64');

// Mock accounts DB before including module to test.
mockRequire('../data/accounts.json', [
  {
    userId: 1234,
    username: 'mockuser',
    password: 'mockpassword',
    role: 'user',
  },
]);

/** Module to test. */
const auth = mockRequire.reRequire('../auth-basic.js');

/** Build Basic authentication header */
function buildHeader(username, password) {
  return 'basic ' + base64.encode(username + ':' + password);
}

describe('Basic authentication middleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = sinon.spy();
  });

  it('should follow the Express middleware signature', () => {
    expect(auth).to.be.a.instanceOf(Function);
    expect(auth.length).to.equal(3);
  });

  it('should reject requests lacking credentials', () => {
    auth(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(next).to.not.have.been.called;
  });

  it('should reject requests with authentication scheme other than Basic', () => {
    req.headers.authorization = 'Bearer ABCDE';
    auth(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(next).to.not.have.been.called;
  });

  it('should provide authorization info to rejected requests', () => {
    auth(req, res, next);
    expect(res.header('WWW-Authenticate')).to.equal(
      'Basic realm="JSON-Server test"'
    );
  });

  it('should reject unknown accounts', () => {
    const username = 'unknownaccount';
    const password = 'unknownpassword';
    req.headers.authorization = buildHeader(username, password);
    auth(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(next).to.not.have.been.called;
  });

  it('should reject bad passwords', () => {
    const username = 'mockuser';
    const password = 'unknownpassword';
    req.headers.authorization = buildHeader(username, password);
    auth(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(next).to.not.have.been.called;
  });

  it('should accept valid credentials', () => {
    const username = 'mockuser';
    const password = 'mockpassword';
    req.headers.authorization = buildHeader(username, password);
    auth(req, res, next);
    expect(res.statusCode).to.equal(200);
    expect(next).to.have.been.called;
  });

  it('should store user info in response locals', () => {
    const username = 'mockuser';
    const password = 'mockpassword';
    const userId = 1234;
    req.headers.authorization = buildHeader(username, password);
    auth(req, res, next);
    expect(res.locals.auth).to.include({ username, userId });
  });
});

// Stop mocking accounts DB.
mockRequire.stop('../data/accounts.json');
