const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
const { expect } = chai;
const supertest = require('supertest');
const { buildHeader, getRandomElement, getAccount } = require('./utils');

/** Get comment list */
function getCommentList() {
  return global.db.comments;
}

/** Get comment */
function getComment(id) {
  // JSON stringify/parse is the simplest way to deep clone an object.
  return JSON.parse(
    JSON.stringify(global.db.comments.find(comment => comment.id == id))
  );
}

describe('Comments', () => {
  let request;
  let userAccount;
  let adminAccount;
  let userHeaders;
  let adminHeaders;

  before(() => {
    request = supertest(global.url);
    userAccount = getAccount('user');
    adminAccount = getAccount('admin');
    userHeaders = {
      authorization: buildHeader(userAccount.username, userAccount.password),
    };
    adminHeaders = {
      authorization: buildHeader(adminAccount.username, adminAccount.password),
    };
  });

  describe('GET /comments', () => {
    const url = '/comments';

    it('should be denied in anonymous mode', async () => {
      await request.get(url).expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .get(url)
        .set(userHeaders)
        .expect(403);
    });
    it('should retrieve full comment list in JSON format in admin mode', async () => {
      const response = await request
        .get(url)
        .set(adminHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(getCommentList().length);
    });
  });

  describe('POST /comments', () => {
    const url = '/comments';
    let newCommentId;
    let newCommentData = { message: 'Test comment' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Delete new comment.
        await request
          .delete(url + '/' + newCommentId)
          .set(adminHeaders)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .post(url)
        .send(newCommentData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .post(url)
        .set(userHeaders)
        .send(newCommentData)
        .expect(403);
    });
    it('should create a new comment in admin mode', async () => {
      const response = await request
        .post(url)
        .set(adminHeaders)
        .send(newCommentData)
        .expect(201);
      success = true;
      newCommentId = response.body.id;
      expect(newCommentId).to.be.a('number');
      expect(response.body)
        .excluding('id')
        .to.deep.equal(newCommentData);
    });
    it('should not overwrite existing comments', async () => {
      const commentId = getRandomElement(getCommentList()).id;
      await request
        .post(url)
        .set(adminHeaders)
        .send({ ...newCommentData, id: commentId })
        .expect(500);
    });
  });

  describe('PUT /comments', () => {
    const url = '/comments';

    it('should fail', async () => {
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /comments', () => {
    const url = '/comments';

    it('should fail', async () => {
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /comments', () => {
    const url = '/comments';

    it('should fail', async () => {
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('GET /comments/:commentId', () => {
    let commentId;
    let url;

    beforeEach(() => {
      // Select random comment.
      commentId = getRandomElement(getCommentList()).id;
      url = '/comments/' + commentId;
    });

    it('should be denied in anonymous mode', async () => {
      await request.get(url).expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .get(url)
        .set(userHeaders)
        .expect(403);
    });
    it('should retrieve comment in JSON format in admin mode', async () => {
      const response = await request
        .get(url)
        .set(adminHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.equal(commentId);
    });
    it('should fail on unknown ID', async () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
      await request
        .get(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('POST /comments/:commentId', () => {
    let commentId;
    let url;

    beforeEach(() => {
      // Select random comment.
      commentId = getRandomElement(getCommentList()).id;
      url = '/comments/' + commentId;
    });

    it('should fail', async () => {
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
    it('should fail on unknown ID', async () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PUT /comments/:commentId', () => {
    let commentId;
    let url;
    let oldCommentData;
    let newCommentData = { message: 'Test comment' };
    let success;

    beforeEach(() => {
      // Select & save random comment.
      commentId = getRandomElement(getCommentList()).id;
      url = '/comments/' + commentId;
      oldCommentData = getComment(commentId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore comment.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldCommentData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .put(url)
        .send(newCommentData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .put(url)
        .set(userHeaders)
        .send(newCommentData)
        .expect(403);
    });
    it('should replace data in admin mode', async () => {
      const response = await request
        .put(url)
        .set(adminHeaders)
        .send(newCommentData)
        .expect(200);
      success = true;
      expect(response.body)
        .to.deep.equal({ ...newCommentData, id: commentId })
        .to.not.deep.equal(oldCommentData);
    });
    it('should fail on unknown ID', async () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /comments/:commentId', () => {
    let commentId;
    let url;
    let oldCommentData;
    let newCommentData = { message: 'Test comment' };
    let success;

    beforeEach(() => {
      // Select & save random comment.
      commentId = getRandomElement(getCommentList()).id;
      url = '/comments/' + commentId;
      oldCommentData = getComment(commentId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore comment.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldCommentData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .patch(url)
        .send(newCommentData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .patch(url)
        .set(userHeaders)
        .send(newCommentData)
        .expect(403);
    });
    it('should update data in admin mode', async () => {
      const response = await request
        .patch(url)
        .set(adminHeaders)
        .send(newCommentData)
        .expect(200);
      success = true;
      expect(response.body).to.deep.equal({
        ...oldCommentData,
        ...newCommentData,
      });
    });
    it('should fail on unknown ID', async () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /comments/:commentId', () => {
    let commentData = { message: 'Test comment' };
    let commentId;
    let url;
    let success;

    beforeEach(async () => {
      // Create new comment.
      const response = await request
        .post('/comments')
        .set(adminHeaders)
        .send(commentData)
        .expect(201);
      commentId = response.body.id;
      url = '/comments/' + commentId;
      success = false;
    });
    afterEach(async () => {
      if (!success) {
        // Delete new comment.
        await request
          .delete(url)
          .set(adminHeaders)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request.delete(url).expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .delete(url)
        .set(userHeaders)
        .expect(403);
    });
    it('should delete comment in admin mode', async () => {
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(200);
      success = true;
      await request
        .get(url)
        .set(adminHeaders)
        .expect(404);
    });
    it('should fail on unknown ID', async () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });
});
