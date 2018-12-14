/// <reference types="Cypress" />

const {
  getRandomElement,
  getAccount,
  getPhotoList,
  getPhoto,
} = require('../support/utils');

describe('Photos', () => {
  let userAccount;
  let adminAccount;
  let userOptions;
  let adminOptions;

  before(() => {
    // Get accounts and set authorization options.
    cy.fixture('test-accounts.json').then(accounts => {
      global.accounts = accounts;
      userAccount = getAccount('user');
      adminAccount = getAccount('admin');
      userOptions = {
        auth: userAccount,
      };
      adminOptions = {
        auth: adminAccount,
      };
    });

    // Get database.
    cy.task('db').then(db => (global.db = db));
  });

  describe('GET /photos', () => {
    const method = 'GET';
    const url = '/photos';

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should be denied in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should retrieve full photo list in JSON format in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.match(
          /^application\/json;?/
        );
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(getPhotoList().length);
      });
    });
  });

  describe('POST /photos', () => {
    const method = 'POST';
    const url = '/photos';
    let newPhotoId;
    let newPhotoData = { title: 'Test photo' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(() => {
      if (success) {
        // Delete new photo.
        cy.request({
          ...adminOptions,
          method: 'DELETE',
          url: url + '/' + newPhotoId,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newPhotoData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should be denied in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
        body: newPhotoData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should create a new photo in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newPhotoData,
      }).then(response => {
        expect(response.status).to.eq(201);
        success = true;
        newPhotoId = response.body.id;
        expect(newPhotoId).to.be.a('number');
        expect(response.body)
          .excluding('id')
          .to.deep.equal(newPhotoData);
      });
    });
    it('should not overwrite existing photos', () => {
      const photoId = getRandomElement(getPhotoList()).id;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: { ...newPhotoData, id: photoId },
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(500);
      });
    });
  });

  describe('PUT /photos', () => {
    const method = 'PUT';
    const url = '/photos';

    it('should fail', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: {},
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('PATCH /photos', () => {
    const method = 'PATCH';
    const url = '/photos';

    it('should fail', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: {},
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('DELETE /photos', () => {
    const method = 'DELETE';
    const url = '/photos';

    it('should fail', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('GET /photos/:photoId', () => {
    const method = 'GET';
    let photoId;
    let url;

    beforeEach(() => {
      // Select random photo.
      photoId = getRandomElement(getPhotoList()).id;
      url = '/photos/' + photoId;
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should be denied in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should retrieve photo in JSON format in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.match(
          /^application\/json;?/
        );
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.equal(photoId);
      });
    });
    it('should fail on unknown ID', () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      cy.request({
        ...adminOptions,
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('POST /photos/:photoId', () => {
    const method = 'POST';
    let photoId;
    let url;

    beforeEach(() => {
      // Select random photo.
      photoId = getRandomElement(getPhotoList()).id;
      url = '/photos/' + photoId;
    });

    it('should fail', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: {},
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
    it('should fail on unknown ID', () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: {},
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('PUT /photos/:photoId', () => {
    const method = 'PUT';
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
    afterEach(() => {
      if (success) {
        // Restore photo.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldPhotoData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newPhotoData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should be denied in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
        body: newPhotoData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should replace data in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newPhotoData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body)
          .to.deep.equal({ ...newPhotoData, id: photoId })
          .to.not.deep.equal(oldPhotoData);
      });
    });
    it('should fail on unknown ID', () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: {},
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('PATCH /photos/:photoId', () => {
    const method = 'PATCH';
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
    afterEach(() => {
      if (success) {
        // Restore photo.
        cy.request({
          ...adminOptions,
          method: 'PATCH',
          url,
          body: oldPhotoData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newPhotoData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should be denied in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
        body: newPhotoData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should update data in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newPhotoData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body).to.deep.equal({
          ...oldPhotoData,
          ...newPhotoData,
        });
      });
    });
    it('should fail on unknown ID', () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: {},
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('DELETE /photos/:photoId', () => {
    const method = 'DELETE';
    let photoData = { title: 'Test photo' };
    let photoId;
    let url;
    let success;

    beforeEach(() => {
      // Create new photo.
      cy.request({
        ...adminOptions,
        method: 'POST',
        url: '/photos',
        body: photoData,
      }).then(response => {
        expect(response.status).to.eq(201);
        photoId = response.body.id;
        url = '/photos/' + photoId;
        success = false;
      });
    });
    afterEach(() => {
      if (!success) {
        // Delete new photo.
        cy.request({
          ...adminOptions,
          method: 'DELETE',
          url,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should be denied in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should delete photo in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        cy.request({
          ...adminOptions,
          method: 'GET',
          url,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(404);
        });
      });
    });
    it('should fail on unknown ID', () => {
      const photoId = 9999;
      const url = '/photos/' + photoId;
      cy.request({
        ...adminOptions,
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
