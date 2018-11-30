const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
const { expect } = chai;
const supertest = require('supertest');
const {
  buildHeader,
  getRandomElement,
  getAccount,
  getAlbumList,
  getAlbum,
} = require('./utils');

describe('Albums', () => {
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

    // Deactivate stale resource deletion for faster rollback.
    global.router.db._.mixin({ getRemovable: () => [] });
  });

  describe('GET /albums', () => {
    const url = '/albums';

    it('should be denied in anonymous mode', async () => {
      await request.get(url).expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .get(url)
        .set(userHeaders)
        .expect(403);
    });
    it('should retrieve full album list in JSON format in admin mode', async () => {
      const response = await request
        .get(url)
        .set(adminHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(getAlbumList().length);
    });
  });

  describe('POST /albums', () => {
    const url = '/albums';
    let newAlbumId;
    let newAlbumData = { title: 'Test album' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Delete new album.
        await request
          .delete(url + '/' + newAlbumId)
          .set(adminHeaders)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .post(url)
        .send(newAlbumData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .post(url)
        .set(userHeaders)
        .send(newAlbumData)
        .expect(403);
    });
    it('should create a new album in admin mode', async () => {
      const response = await request
        .post(url)
        .set(adminHeaders)
        .send(newAlbumData)
        .expect(201);
      success = true;
      newAlbumId = response.body.id;
      expect(newAlbumId).to.be.a('number');
      expect(response.body)
        .excluding('id')
        .to.deep.equal(newAlbumData);
    });
    it('should not overwrite existing albums', async () => {
      const albumId = getRandomElement(getAlbumList()).id;
      await request
        .post(url)
        .set(adminHeaders)
        .send({ ...newAlbumData, id: albumId })
        .expect(500);
    });
  });

  describe('PUT /albums', () => {
    const url = '/albums';

    it('should fail', async () => {
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /albums', () => {
    const url = '/albums';

    it('should fail', async () => {
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /albums', () => {
    const url = '/albums';

    it('should fail', async () => {
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('GET /albums/:albumId', () => {
    let albumId;
    let url;

    beforeEach(() => {
      // Select random album.
      albumId = getRandomElement(getAlbumList()).id;
      url = '/albums/' + albumId;
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
    it('should retrieve album in JSON format in admin mode', async () => {
      const response = await request
        .get(url)
        .set(adminHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.equal(albumId);
    });
    it('should fail on unknown ID', async () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
      await request
        .get(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('POST /albums/:albumId', () => {
    let albumId;
    let url;

    beforeEach(() => {
      // Select random album.
      albumId = getRandomElement(getAlbumList()).id;
      url = '/albums/' + albumId;
    });

    it('should fail', async () => {
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
    it('should fail on unknown ID', async () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PUT /albums/:albumId', () => {
    let albumId;
    let url;
    let oldAlbumData;
    let newAlbumData = { title: 'Test album' };
    let success;

    beforeEach(() => {
      // Select & save random album.
      albumId = getRandomElement(getAlbumList()).id;
      url = '/albums/' + albumId;
      oldAlbumData = getAlbum(albumId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore album.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldAlbumData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .put(url)
        .send(newAlbumData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .put(url)
        .set(userHeaders)
        .send(newAlbumData)
        .expect(403);
    });
    it('should replace data in admin mode', async () => {
      const response = await request
        .put(url)
        .set(adminHeaders)
        .send(newAlbumData)
        .expect(200);
      success = true;
      expect(response.body)
        .to.deep.equal({ ...newAlbumData, id: albumId })
        .to.not.deep.equal(oldAlbumData);
    });
    it('should fail on unknown ID', async () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /albums/:albumId', () => {
    let albumId;
    let url;
    let oldAlbumData;
    let newAlbumData = { title: 'Test album' };
    let success;

    beforeEach(() => {
      // Select & save random album.
      albumId = getRandomElement(getAlbumList()).id;
      url = '/albums/' + albumId;
      oldAlbumData = getAlbum(albumId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore album.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldAlbumData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .patch(url)
        .send(newAlbumData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .patch(url)
        .set(userHeaders)
        .send(newAlbumData)
        .expect(403);
    });
    it('should update data in admin mode', async () => {
      const response = await request
        .patch(url)
        .set(adminHeaders)
        .send(newAlbumData)
        .expect(200);
      success = true;
      expect(response.body).to.deep.equal({
        ...oldAlbumData,
        ...newAlbumData,
      });
    });
    it('should fail on unknown ID', async () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /albums/:albumId', () => {
    let albumData = { title: 'Test album' };
    let albumId;
    let url;
    let success;

    beforeEach(async () => {
      // Create new album.
      const response = await request
        .post('/albums')
        .set(adminHeaders)
        .send(albumData)
        .expect(201);
      albumId = response.body.id;
      url = '/albums/' + albumId;
      success = false;
    });
    afterEach(async () => {
      if (!success) {
        // Delete new album.
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
    it('should delete album in admin mode', async () => {
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
      const albumId = 9999;
      const url = '/albums/' + albumId;
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });
});
