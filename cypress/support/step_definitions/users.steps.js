const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement, getUserList } = require('../utils');

// User list
When('I get the User list', function() {
  cy.world().then(world => {
    const url = '/users';
    cy.request({
      ...world.options,
      method: 'GET',
      url,
      failOnStatusCode: false,
    }).as('response');
  });
});

Then('I should get the complete User list', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(getUserList().length);
    });
  });
});

// Users
Given('a new User {string}', function(v) {
  cy.world().then(world => {
    const data = { username: 'test_user' };
    world.setVariable(v, { data });
  });
});

When('I get the User {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = `/users/${id}`;
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
When('I create the User {string}', function(v) {
  cy.world().then(world => {
    const url = '/users';
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
When('I update the User {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = '/users/' + world.getVariable(v1);
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
When('I replace the User {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = '/users/' + world.getVariable(v1);
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
When('I delete the User {string}', function(v) {
  cy.world().then(world => {
    const url = '/users/' + world.getVariable(v);
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

Then('I should get the User {string}', function(v) {
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
Then('the User should be created as {string}', function(v) {
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
Then('the User should be updated as {string}', function(v) {
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
Then('the User should be replaced as {string}', function(v) {
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
Then('the User should not be created', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(500);
    });
  });
});

Then('the User {string} should equal the User {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: user1 } = world.getVariable(v1);
    const { data: user2 } = world.getVariable(v2);
    expect(user1)
      .excluding('id')
      .to.deep.equal(user2);
  });
});
Then('the User {string} should include the User {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: user1 } = world.getVariable(v1);
    const { data: user2 } = world.getVariable(v2);
    expect(user1).to.include(user2);
  });
});

// User Ids
Given('an existing User Id {string}', function(v) {
  cy.world().then(world => {
    const user = getRandomElement(
      getUserList(),
      user => !world.account || user.id !== world.account.userId
    );
    world.setVariable(v, user.id);
  });
});
Given('an unknown User Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the User Id {string} of the User {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: user } = world.getVariable(v2);
    world.setVariable(v1, user.id);
  });
});
