const {
  buildHeader,
  getRandomElement,
  getAccount,
  getUserList,
  getUser,
} = require('./utils');

describe('Users', () => {
  let request;
  let userAccount;
  let adminAccount;
  let userHeaders;
  let adminHeaders;

  before(() => {
    // Create requester with API root URL.
    request = supertest(global.url);

    // Get accounts and authorization headers.
    userAccount = getAccount('user');
    adminAccount = getAccount('admin');
    userHeaders = {
      authorization: buildHeader(userAccount.username, userAccount.password),
    };
    adminHeaders = {
      authorization: buildHeader(adminAccount.username, adminAccount.password),
    };
  });

  describe('GET /users', () => {
    const url = '/users';

    it('should be denied in anonymous mode', async () => {
      await request.get(url).expect(401);
    });
    it('should retrieve full user list in JSON format in user mode', async () => {
      const response = await request
        .get(url)
        .set(userHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(getUserList().length);
    });
  });

  describe('POST /users', () => {
    const url = '/users';
    let newUserId;
    let newUserData = { username: 'test_user' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Delete new user.
        await request
          .delete(url + '/' + newUserId)
          .set(adminHeaders)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .post(url)
        .send(newUserData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .post(url)
        .set(userHeaders)
        .send(newUserData)
        .expect(403);
    });
    it('should create a new user in admin mode', async () => {
      const response = await request
        .post(url)
        .set(adminHeaders)
        .send(newUserData)
        .expect(201);
      success = true;
      newUserId = response.body.id;
      expect(newUserId).to.be.a('number');
      expect(response.body)
        .excluding('id')
        .to.deep.equal(newUserData);
    });
    it('should not overwrite existing users', async () => {
      const userId = getRandomElement(getUserList()).id;
      await request
        .post(url)
        .set(adminHeaders)
        .send({ ...newUserData, id: userId })
        .expect(500);
    });
  });

  describe('PUT /users', () => {
    const url = '/users';

    it('should fail', async () => {
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /users', () => {
    const url = '/users';

    it('should fail', async () => {
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /users', () => {
    const url = '/users';

    it('should fail', async () => {
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('GET /users/:userId', () => {
    let userId;
    let url;

    beforeEach(() => {
      // Select random user.
      userId = getRandomElement(getUserList()).id;
      url = '/users/' + userId;
    });

    it('should retrieve user in JSON format', async () => {
      const response = await request
        .get(url)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.equal(userId);
    });
    it('should fail on unknown ID', async () => {
      const userId = 9999;
      const url = '/users/' + userId;
      await request.get(url).expect(404);
    });
  });

  describe('POST /users/:userId', () => {
    let userId;
    let url;

    beforeEach(() => {
      // Select random user.
      userId = getRandomElement(getUserList()).id;
      url = '/users/' + userId;
    });

    it('should fail', async () => {
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
    it('should fail on unknown ID', async () => {
      const userId = 9999;
      const url = '/users/' + userId;
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PUT /users/:userId', () => {
    let userId;
    let url;
    let oldUserData;
    let newUserData = { username: 'test_user' };
    let success;

    beforeEach(() => {
      // Select & save random user.
      userId = getRandomElement(
        getUserList(),
        user => user.id !== userAccount.userId
      ).id;
      url = '/users/' + userId;
      oldUserData = getUser(userId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore user.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldUserData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .put(url)
        .send(newUserData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .put(url)
        .set(userHeaders)
        .send(newUserData)
        .expect(403);
    });
    it('should replace data in private mode', async () => {
      const userId = userAccount.userId;
      const url = '/users/' + userId;
      const oldUserData = getUser(userId);
      const response = await request
        .put(url)
        .set(userHeaders)
        .send(newUserData)
        .expect(200);
      expect(response.body)
        .to.deep.equal({ ...newUserData, id: userId })
        .to.not.deep.equal(oldUserData);

      // Restore user.
      await request
        .put(url)
        .set(adminHeaders)
        .send(oldUserData)
        .expect(200);
    });
    it('should replace data in admin mode', async () => {
      const response = await request
        .put(url)
        .set(adminHeaders)
        .send(newUserData)
        .expect(200);
      success = true;
      expect(response.body)
        .to.deep.equal({ ...newUserData, id: userId })
        .to.not.deep.equal(oldUserData);
    });
    it('should fail on unknown ID', async () => {
      const userId = 9999;
      const url = '/users/' + userId;
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /users/:userId', () => {
    let userId;
    let url;
    let oldUserData;
    let newUserData = { username: 'test_user' };
    let success;

    beforeEach(() => {
      // Select & save random user.
      userId = getRandomElement(
        getUserList(),
        user => user.id !== userAccount.userId
      ).id;
      url = '/users/' + userId;
      oldUserData = getUser(userId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore user.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldUserData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .patch(url)
        .send(newUserData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .patch(url)
        .set(userHeaders)
        .send(newUserData)
        .expect(403);
    });
    it('should update data in private mode', async () => {
      const userId = userAccount.userId;
      const url = '/users/' + userId;
      const oldUserData = getUser(userId);
      const response = await request
        .patch(url)
        .set(userHeaders)
        .send(newUserData)
        .expect(200);
      expect(response.body).to.deep.equal({ ...oldUserData, ...newUserData });

      // Restore user.
      await request
        .put(url)
        .set(adminHeaders)
        .send(oldUserData)
        .expect(200);
    });
    it('should update data in admin mode', async () => {
      const response = await request
        .patch(url)
        .set(adminHeaders)
        .send(newUserData)
        .expect(200);
      success = true;
      expect(response.body).to.deep.equal({ ...oldUserData, ...newUserData });
    });
    it('should fail on unknown ID', async () => {
      const userId = 9999;
      const url = '/users/' + userId;
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /users/:userId', () => {
    let userData = { username: 'test_user' };
    let userId;
    let url;
    let success;

    beforeEach(async () => {
      // Create new user.
      const response = await request
        .post('/users')
        .set(adminHeaders)
        .send(userData)
        .expect(201);
      userId = response.body.id;
      url = '/users/' + userId;
      success = false;
    });
    afterEach(async () => {
      if (!success) {
        // Delete new user.
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
    it('should delete user in private mode', async () => {
      const userId = userAccount.userId;
      const url = '/users/' + userId;
      const userData = getUser(userId);
      await request
        .delete(url)
        .set(userHeaders)
        .expect(200);
      await request
        .get(url)
        .set(adminHeaders)
        .expect(404);

      // Restore user.
      await request
        .post('/users')
        .set(adminHeaders)
        .send(userData)
        .expect(201);
    });
    it('should delete user in admin mode', async () => {
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
      const userId = 9999;
      const url = '/users/' + userId;
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });
});
