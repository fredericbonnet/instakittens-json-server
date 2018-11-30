const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
const { expect } = chai;
const supertest = require('supertest');
const {
  buildHeader,
  getRandomElement,
  getAccount,
  getPhotoList,
  getPhoto,
} = require('./utils');

describe('Photos', () => {
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

  describe('GET /photos', () => {
    const url = '/photos';

    it('should be denied in anonymous mode', async () => {
      await request.get(url).expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .get(url)
        .set(userHeaders)
        .expect(403);
    });
    it('should retrieve full photo list in JSON format in admin mode', async () => {
      const response = await request
        .get(url)
        .set(adminHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(getPhotoList().length);
    });
  });

  describe('POST /photos', () => {
    const url = '/photos';
    let newPhotoId;
    let newPhotoData = { title: 'Test photo' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Delete new photo.
        await request
          .delete(url + '/' + newPhotoId)
          .set(adminHeaders)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .post(url)
        .send(newPhotoData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .post(url)
        .set(userHeaders)
        .send(newPhotoData)
        .expect(403);
    });
    it('should create a new photo in admin mode', async () => {
      const response = await request
        .post(url)
        .set(adminHeaders)
        .send(newPhotoData)
        .expect(201);
      success = true;
      newPhotoId = response.body.id;
      expect(newPhotoId).to.be.a('number');
      expect(response.body)
        .excluding('id')
        .to.deep.equal(newPhotoData);
    });
    it('should not overwrite existing photos', async () => {
      const photoId = getRandomElement(getPhotoList()).id;
      await request
        .post(url)
        .set(adminHeaders)
        .send({ ...newPhotoData, id: photoId })
        .expect(500);
    });
  });

  describe('PUT /photos', () => {
    const url = '/photos';

    it('should fail', async () => {
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /photos', () => {
    const url = '/photos';

    it('should fail', async () => {
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /photos', () => {
    const url = '/photos';

    it('should fail', async () => {
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('GET /photos/:photoId', () => {
    let photoId;
    let url;

    beforeEach(() => {
      // Select random photo.
      photoId = getRandomElement(getPhotoList()).id;
      url = '/photos/' + photoId;
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
    it('should retrieve photo in JSON format in admin mode', async () => {
      const response = await request
        .get(url)
        .set(adminHeaders)
        .expect(200)
        .expect('content-type', /^application\/json;?/);
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.equal(photoId);
    });
    it('should fail on unknown ID', async () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      await request
        .get(url)
        .set(adminHeaders)
        .expect(404);
    });
  });

  describe('POST /photos/:photoId', () => {
    let photoId;
    let url;

    beforeEach(() => {
      // Select random photo.
      photoId = getRandomElement(getPhotoList()).id;
      url = '/photos/' + photoId;
    });

    it('should fail', async () => {
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
    it('should fail on unknown ID', async () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      await request
        .post(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PUT /photos/:photoId', () => {
    let photoId;
    let url;
    let oldPhotoData;
    let newPhotoData = { title: 'Test photo' };
    let success;

    beforeEach(() => {
      // Select & save random photo.
      photoId = getRandomElement(getPhotoList()).id;
      url = '/photos/' + photoId;
      oldPhotoData = getPhoto(photoId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore photo.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldPhotoData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .put(url)
        .send(newPhotoData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .put(url)
        .set(userHeaders)
        .send(newPhotoData)
        .expect(403);
    });
    it('should replace data in admin mode', async () => {
      const response = await request
        .put(url)
        .set(adminHeaders)
        .send(newPhotoData)
        .expect(200);
      success = true;
      expect(response.body)
        .to.deep.equal({ ...newPhotoData, id: photoId })
        .to.not.deep.equal(oldPhotoData);
    });
    it('should fail on unknown ID', async () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      await request
        .put(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /photos/:photoId', () => {
    let photoId;
    let url;
    let oldPhotoData;
    let newPhotoData = { title: 'Test photo' };
    let success;

    beforeEach(() => {
      // Select & save random photo.
      photoId = getRandomElement(getPhotoList()).id;
      url = '/photos/' + photoId;
      oldPhotoData = getPhoto(photoId);
      success = false;
    });
    afterEach(async () => {
      if (success) {
        // Restore photo.
        await request
          .put(url)
          .set(adminHeaders)
          .send(oldPhotoData)
          .expect(200);
      }
    });

    it('should be denied in anonymous mode', async () => {
      await request
        .patch(url)
        .send(newPhotoData)
        .expect(401);
    });
    it('should be denied in user mode', async () => {
      await request
        .patch(url)
        .set(userHeaders)
        .send(newPhotoData)
        .expect(403);
    });
    it('should update data in admin mode', async () => {
      const response = await request
        .patch(url)
        .set(adminHeaders)
        .send(newPhotoData)
        .expect(200);
      success = true;
      expect(response.body).to.deep.equal({
        ...oldPhotoData,
        ...newPhotoData,
      });
    });
    it('should fail on unknown ID', async () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      await request
        .patch(url)
        .set(adminHeaders)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /photos/:photoId', () => {
    let photoData = { title: 'Test photo' };
    let photoId;
    let url;
    let success;

    beforeEach(async () => {
      // Create new photo.
      const response = await request
        .post('/photos')
        .set(adminHeaders)
        .send(photoData)
        .expect(201);
      photoId = response.body.id;
      url = '/photos/' + photoId;
      success = false;
    });
    afterEach(async () => {
      if (!success) {
        // Delete new photo.
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
    it('should delete photo in admin mode', async () => {
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
      const photoId = 9999;
      const url = '/photos/' + photoId;
      await request
        .delete(url)
        .set(adminHeaders)
        .expect(404);
    });
  });
});
