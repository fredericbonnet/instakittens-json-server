/// <reference types="Cypress" />

const {
  getRandomElement,
  getAccount,
  getAlbumList,
  getAlbum,
} = require('../support/utils');

describe('Albums', () => {
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

  describe('GET /albums', () => {
    const method = 'GET';
    const url = '/albums';

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
    it('should retrieve full album list in JSON format in admin mode', () => {
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
        expect(response.body).to.have.lengthOf(getAlbumList().length);
      });
    });
  });

  describe('POST /albums', () => {
    const method = 'POST';
    const url = '/albums';
    let newAlbumId;
    let newAlbumData = { title: 'Test album' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(() => {
      if (success) {
        // Delete new album.
        cy.request({
          ...adminOptions,
          method: 'DELETE',
          url: url + '/' + newAlbumId,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newAlbumData,
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
        body: newAlbumData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should create a new album in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newAlbumData,
      }).then(response => {
        expect(response.status).to.eq(201);
        success = true;
        newAlbumId = response.body.id;
        expect(newAlbumId).to.be.a('number');
        expect(response.body)
          .excluding('id')
          .to.deep.equal(newAlbumData);
      });
    });
    it('should not overwrite existing albums', () => {
      const albumId = getRandomElement(getAlbumList()).id;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: { ...newAlbumData, id: albumId },
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(500);
      });
    });
  });

  describe('PUT /albums', () => {
    const method = 'PUT';
    const url = '/albums';

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

  describe('PATCH /albums', () => {
    const method = 'PATCH';
    const url = '/albums';

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

  describe('DELETE /albums', () => {
    const method = 'DELETE';
    const url = '/albums';

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

  describe('GET /albums/:albumId', () => {
    const method = 'GET';
    let albumId;
    let url;

    beforeEach(() => {
      // Select random album.
      albumId = getRandomElement(getAlbumList()).id;
      url = '/albums/' + albumId;
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
    it('should retrieve album in JSON format in admin mode', () => {
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
        expect(response.body.id).to.equal(albumId);
      });
    });
    it('should fail on unknown ID', () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
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

  describe('POST /albums/:albumId', () => {
    const method = 'POST';
    let albumId;
    let url;

    beforeEach(() => {
      // Select random album.
      albumId = getRandomElement(getAlbumList()).id;
      url = '/albums/' + albumId;
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
      const albumId = 9999;
      const url = '/albums/' + albumId;
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

  describe('PUT /albums/:albumId', () => {
    const method = 'PUT';
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
    afterEach(() => {
      if (success) {
        // Restore album.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldAlbumData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newAlbumData,
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
        body: newAlbumData,
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
        body: newAlbumData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body)
          .to.deep.equal({ ...newAlbumData, id: albumId })
          .to.not.deep.equal(oldAlbumData);
      });
    });
    it('should fail on unknown ID', () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
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

  describe('PATCH /albums/:albumId', () => {
    const method = 'PATCH';
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
    afterEach(() => {
      if (success) {
        // Restore album.
        cy.request({
          ...adminOptions,
          method: 'PATCH',
          url,
          body: oldAlbumData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newAlbumData,
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
        body: newAlbumData,
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
        body: newAlbumData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body).to.deep.equal({
          ...oldAlbumData,
          ...newAlbumData,
        });
      });
    });
    it('should fail on unknown ID', () => {
      const albumId = 9999;
      const url = '/albums/' + albumId;
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

  describe('DELETE /albums/:albumId', () => {
    const method = 'DELETE';
    let albumData = { title: 'Test album' };
    let albumId;
    let url;
    let success;

    beforeEach(() => {
      // Create new album.
      cy.request({
        ...adminOptions,
        method: 'POST',
        url: '/albums',
        body: albumData,
      }).then(response => {
        expect(response.status).to.eq(201);
        albumId = response.body.id;
        url = '/albums/' + albumId;
        success = false;
      });
    });
    afterEach(() => {
      if (!success) {
        // Delete new album.
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
    it('should delete album in admin mode', () => {
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
      const albumId = 9999;
      const url = '/albums/' + albumId;
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
