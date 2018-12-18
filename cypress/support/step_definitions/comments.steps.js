const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement, getCommentList } = require('../utils');

// Comment list
When('I get the Comment list', function() {
  cy.world().then(world => {
    const url = world.getRoot() + '/comments';
    cy.request({
      ...world.options,
      method: 'GET',
      url,
      failOnStatusCode: false,
    }).as('response');
  });
});

Then('I should get the complete Comment list', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(response.body).to.be.an('array');
      const commentList = getCommentList().filter(comment =>
        world.isChild(comment)
      );
      expect(response.body).to.have.lengthOf(commentList.length);
    });
  });
});

// Comments
Given('a new Comment {string}', function(v) {
  cy.world().then(world => {
    const data = { message: 'Test comment' };
    world.setVariable(v, { data });
  });
});

When('I get the Comment {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = world.getRoot() + `/comments/${id}`;
    cy.request({
      ...world.options,
      method: 'GET',
      url,
      failOnStatusCode: false,
    }).then(response => {
      response.url = url;
      cy.wrap(response).as('response');
    });
  });
});
When('I create the Comment {string}', function(v) {
  cy.world().then(world => {
    const url = world.getRoot() + '/comments';
    const { data } = world.getVariable(v);
    cy.request({
      ...world.options,
      method: 'POST',
      url,
      body: data,
      failOnStatusCode: false,
    }).then(response => {
      response.url = url;
      cy.wrap(response).as('response');
    });
  });
});
When('I update the Comment {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = world.getRoot() + '/comments/' + world.getVariable(v1);
    const { data } = world.getVariable(v2);
    cy.request({
      ...world.options,
      method: 'PATCH',
      url,
      body: data,
      failOnStatusCode: false,
    }).then(response => {
      response.url = url;
      cy.wrap(response).as('response');
    });
  });
});
When('I replace the Comment {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = world.getRoot() + '/comments/' + world.getVariable(v1);
    const { data } = world.getVariable(v2);
    cy.request({
      ...world.options,
      method: 'PUT',
      url,
      body: data,
      failOnStatusCode: false,
    }).then(response => {
      response.url = url;
      cy.wrap(response).as('response');
    });
  });
});
When('I delete the Comment {string}', function(v) {
  cy.world().then(world => {
    const url = world.getRoot() + '/comments/' + world.getVariable(v);
    cy.request({
      ...world.options,
      method: 'DELETE',
      url,
      failOnStatusCode: false,
    }).then(response => {
      response.url = url;
      cy.wrap(response).as('response');
    });
  });
});

Then('I should get the Comment {string}', function(v) {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(response.body).to.be.an('object');
      const { url, body: data } = response;
      world.setVariable(v, { url, data });
    });
  });
});
Then('the Comment should be created as {string}', function(v) {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(201);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(this.response.body).to.be.an('object');
      const {
        headers: { location: url },
        body: data,
      } = this.response;
      world.setVariable(v, { url, data });
    });
  });
});
Then('the Comment should be updated as {string}', function(v) {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(this.response.body).to.be.an('object');
      const { url, body: data } = response;
      world.setVariable(v, { url, data });
    });
  });
});
Then('the Comment should be replaced as {string}', function(v) {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(this.response.body).to.be.an('object');
      const { url, body: data } = response;
      world.setVariable(v, { url, data });
    });
  });
});
Then('the Comment should not be created', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(500);
    });
  });
});

Then('the Comment {string} should equal the Comment {string}', function(
  v1,
  v2
) {
  cy.world().then(world => {
    const { data: comment1 } = world.getVariable(v1);
    const { data: comment2 } = world.getVariable(v2);
    expect(comment1)
      .excluding('id')
      .to.deep.equal(comment2);
  });
});
Then('the Comment {string} should include the Comment {string}', function(
  v1,
  v2
) {
  cy.world().then(world => {
    const { data: comment1 } = world.getVariable(v1);
    const { data: comment2 } = world.getVariable(v2);
    expect(comment1).to.include(comment2);
  });
});

// Comment Ids
Given('an existing Comment Id {string}', function(v) {
  cy.world().then(world => {
    const commentList = getCommentList().filter(comment =>
      world.isChild(comment)
    );
    const comment = getRandomElement(commentList);
    world.setVariable(v, comment.id);
  });
});
Given('an unknown Comment Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the Comment Id {string} of the Comment {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: comment } = world.getVariable(v2);
    world.setVariable(v1, comment.id);
  });
});
Given('the User Id {string} of the Comment {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: comment } = world.getVariable(v2);
    world.setVariable(v1, comment.user_id);
  });
});
Given('the Photo Id {string} of the Comment {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: comment } = world.getVariable(v2);
    world.setVariable(v1, comment.photo_id);
  });
});
