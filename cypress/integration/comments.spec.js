/// <reference types="Cypress" />

const {
  getRandomElement,
  getAccount,
  getCommentList,
  getComment,
} = require('../support/utils');

describe('Comments', () => {
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

  describe('GET /comments', () => {
    const method = 'GET';
    const url = '/comments';

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
    it('should retrieve full comment list in JSON format in admin mode', () => {
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
        expect(response.body).to.have.lengthOf(getCommentList().length);
      });
    });
  });

  describe('POST /comments', () => {
    const method = 'POST';
    const url = '/comments';
    let newCommentId;
    let newCommentData = { message: 'Test comment' };
    let success;

    beforeEach(() => {
      success = false;
    });
    afterEach(() => {
      if (success) {
        // Delete new comment.
        cy.request({
          ...adminOptions,
          method: 'DELETE',
          url: url + '/' + newCommentId,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newCommentData,
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
        body: newCommentData,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(403);
      });
    });
    it('should create a new comment in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url,
        body: newCommentData,
      }).then(response => {
        expect(response.status).to.eq(201);
        success = true;
        newCommentId = response.body.id;
        expect(newCommentId).to.be.a('number');
        expect(response.body)
          .excluding('id')
          .to.deep.equal(newCommentData);
      });
    });
    it('should not overwrite existing comments', () => {
      const commentId = getRandomElement(getCommentList()).id;
      cy.request({
        ...adminOptions,
        method,
        url,
        body: { ...newCommentData, id: commentId },
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(500);
      });
    });
  });

  describe('PUT /comments', () => {
    const method = 'PUT';
    const url = '/comments';

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

  describe('PATCH /comments', () => {
    const method = 'PATCH';
    const url = '/comments';

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

  describe('DELETE /comments', () => {
    const method = 'DELETE';
    const url = '/comments';

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

  describe('GET /comments/:commentId', () => {
    const method = 'GET';
    let commentId;
    let url;

    beforeEach(() => {
      // Select random comment.
      commentId = getRandomElement(getCommentList()).id;
      url = '/comments/' + commentId;
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
    it('should retrieve comment in JSON format in admin mode', () => {
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
        expect(response.body.id).to.equal(commentId);
      });
    });
    it('should fail on unknown ID', () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
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

  describe('POST /comments/:commentId', () => {
    const method = 'POST';
    let commentId;
    let url;

    beforeEach(() => {
      // Select random comment.
      commentId = getRandomElement(getCommentList()).id;
      url = '/comments/' + commentId;
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
      const commentId = 9999;
      const url = '/comments/' + commentId;
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

  describe('PUT /comments/:commentId', () => {
    const method = 'PUT';
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
    afterEach(() => {
      if (success) {
        // Restore comment.
        cy.request({
          ...adminOptions,
          method: 'PUT',
          url,
          body: oldCommentData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newCommentData,
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
        body: newCommentData,
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
        body: newCommentData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body)
          .to.deep.equal({ ...newCommentData, id: commentId })
          .to.not.deep.equal(oldCommentData);
      });
    });
    it('should fail on unknown ID', () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
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

  describe('PATCH /comments/:commentId', () => {
    const method = 'PATCH';
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
    afterEach(() => {
      if (success) {
        // Restore comment.
        cy.request({
          ...adminOptions,
          method: 'PATCH',
          url,
          body: oldCommentData,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      }
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url,
        body: newCommentData,
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
        body: newCommentData,
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
        body: newCommentData,
      }).then(response => {
        expect(response.status).to.eq(200);
        success = true;
        expect(response.body).to.deep.equal({
          ...oldCommentData,
          ...newCommentData,
        });
      });
    });
    it('should fail on unknown ID', () => {
      const commentId = 9999;
      const url = '/comments/' + commentId;
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

  describe('DELETE /comments/:commentId', () => {
    const method = 'DELETE';
    let commentData = { message: 'Test comment' };
    let commentId;
    let url;
    let success;

    beforeEach(() => {
      // Create new comment.
      cy.request({
        ...adminOptions,
        method: 'POST',
        url: '/comments',
        body: commentData,
      }).then(response => {
        expect(response.status).to.eq(201);
        commentId = response.body.id;
        url = '/comments/' + commentId;
        success = false;
      });
    });
    afterEach(() => {
      if (!success) {
        // Delete new comment.
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
    it('should delete comment in admin mode', () => {
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
      const commentId = 9999;
      const url = '/comments/' + commentId;
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
