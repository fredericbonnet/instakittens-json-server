/// <reference types="Cypress" />

const {
  getRandomElement,
  getAccount,
  getUserList,
  getUser,
} = require('../support/utils');

describe('Users', () => {
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

  describe('GET /users', () => {
    const method = 'GET';
    const url = '/users';

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should retrieve full user list in JSON format in user mode', () => {
      cy.request({
        ...userOptions,
        method,
        url,
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.match(
          /^application\/json;?/
        );
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(getUserList().length);
      });
    });
  });

  describe('POST /users', () => {
    const method = 'POST';
    const url = '/users';
    let newUserId;
    let newUserData = { username: 'test_user' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(() => {
      if (success) {
        // Delete new user.
        cy.request({
          ...adminOptions,
          method: 'DELETE',
          url: url + '/' + newUserId,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newUserData,
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
        body: newUserData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should create a new user in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newUserData,
      }).then(response => {
        expect(response.status).to.eq(201);
        success = true;
        newUserId = response.body.id;
        expect(newUserId).to.be.a('number');
        expect(response.body)
          .excluding('id')
          .to.deep.equal(newUserData);
      });
    });
    it('should not overwrite existing users', () => {
      const userId = getRandomElement(getUserList()).id;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: { ...newUserData, id: userId },
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(500);
      });
    });
  });

  describe('PUT /users', () => {
    const method = 'PUT';
    const url = '/users';

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

  describe('PATCH /users', () => {
    const method = 'PATCH';
    const url = '/users';

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

  describe('DELETE /users', () => {
    const method = 'DELETE';
    const url = '/users';

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

  describe('GET /users/:userId', () => {
    const method = 'GET';
    let userId;
    let url;

    beforeEach(() => {
      // Select random user.
      userId = getRandomElement(getUserList()).id;
      url = '/users/' + userId;
    });

    it('should retrieve user in JSON format', () => {
      cy.request({
        method,
        url,
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.match(
          /^application\/json;?/
        );
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.equal(userId);
      });
    });
    it('should fail on unknown ID', () => {
      const userId = 9999;
      const url = '/users/' + userId;
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

  describe('POST /users/:userId', () => {
    const method = 'POST';
    let userId;
    let url;

    beforeEach(() => {
      // Select random user.
      userId = getRandomElement(getUserList()).id;
      url = '/users/' + userId;
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
      const userId = 9999;
      const url = '/users/' + userId;
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

  describe('PUT /users/:userId', () => {
    const method = 'PUT';
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
    afterEach(() => {
      if (success) {
        // Restore user.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldUserData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newUserData,
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
        body: newUserData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should replace data in private mode', () => {
      const userId = userAccount.userId;
      const url = '/users/' + userId;
      const oldUserData = getUser(userId);
      cy.request({
        ...userOptions,
        method,
        url,
        body: newUserData,
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body)
          .to.deep.equal({ ...newUserData, id: userId })
          .to.not.deep.equal(oldUserData);

        // Restore user.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldUserData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      });
    });
    it('should replace data in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newUserData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body)
          .to.deep.equal({ ...newUserData, id: userId })
          .to.not.deep.equal(oldUserData);
      });
    });
    it('should fail on unknown ID', () => {
      const userId = 9999;
      const url = '/users/' + userId;
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

  describe('PATCH /users/:userId', () => {
    const method = 'PATCH';
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
    afterEach(() => {
      if (success) {
        // Restore user.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldUserData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newUserData,
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
        body: newUserData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should update data in private mode', () => {
      const userId = userAccount.userId;
      const url = '/users/' + userId;
      const oldUserData = getUser(userId);
      cy.request({
        ...userOptions,
        method,
        url,
        body: newUserData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body).to.deep.equal({
          ...oldUserData,
          ...newUserData,
        });

        // Restore user.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldUserData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      });
    });
    it('should update data in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newUserData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body).to.deep.equal({
          ...oldUserData,
          ...newUserData,
        });
      });
    });
    it('should fail on unknown ID', () => {
      const userId = 9999;
      const url = '/users/' + userId;
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

  describe('DELETE /users/:userId', () => {
    const method = 'DELETE';
    let userData = { username: 'test_user' };
    let userId;
    let url;
    let success;

    beforeEach(() => {
      // Create new user.
      cy.request({
        ...adminOptions,
        method: 'POST',
        url: '/users',
        body: userData,
      }).then(response => {
        expect(response.status).to.eq(201);
        userId = response.body.id;
        url = '/users/' + userId;
        success = false;
      });
    });
    afterEach(() => {
      if (!success) {
        // Delete new user.
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
    it('should delete user in private mode', () => {
      const userId = userAccount.userId;
      const url = '/users/' + userId;
      const userData = getUser(userId);
      cy.request({
        ...userOptions,
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

          // Restore user.
          cy.request({
            ...adminOptions,
            method: 'POST',
            url: '/users',
            body: userData,
          }).then(response => {
            expect(response.status).to.eq(201);
          });
        });
      });
    });
    it('should delete user in admin mode', () => {
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
      const userId = 9999;
      const url = '/users/' + userId;
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
