const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement, getPhotoList } = require('../utils');

// Photo list
When('I get the Photo list', function() {
  cy.world().then(world => {
    const url = world.getRoot() + '/photos';
    cy.request({
      ...world.options,
      method: 'GET',
      url,
      failOnStatusCode: false,
    }).as('response');
  });
});

Then('I should get the complete Photo list', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(response.body).to.be.an('array');
      const photoList = getPhotoList().filter(photo => world.isChild(photo));
      expect(response.body).to.have.lengthOf(photoList.length);
    });
  });
});

// Photos
Given('a new Photo {string}', function(v) {
  cy.world().then(world => {
    const data = { title: 'Test photo' };
    world.setVariable(v, { data });
  });
});

When('I get the Photo {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = world.getRoot() + `/photos/${id}`;
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
When('I create the Photo {string}', function(v) {
  cy.world().then(world => {
    const url = world.getRoot() + '/photos';
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
When('I update the Photo {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = world.getRoot() + '/photos/' + world.getVariable(v1);
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
When('I replace the Photo {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = world.getRoot() + '/photos/' + world.getVariable(v1);
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
When('I delete the Photo {string}', function(v) {
  cy.world().then(world => {
    const url = world.getRoot() + '/photos/' + world.getVariable(v);
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

Then('I should get the Photo {string}', function(v) {
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
Then('the Photo should be created as {string}', function(v) {
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
Then('the Photo should be updated as {string}', function(v) {
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
Then('the Photo should be replaced as {string}', function(v) {
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
Then('the Photo should not be created', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(500);
    });
  });
});

Then('the Photo {string} should equal the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo1 } = world.getVariable(v1);
    const { data: photo2 } = world.getVariable(v2);
    expect(photo1)
      .excluding('id')
      .to.deep.equal(photo2);
  });
});
Then('the Photo {string} should include the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo1 } = world.getVariable(v1);
    const { data: photo2 } = world.getVariable(v2);
    expect(photo1).to.include(photo2);
  });
});

// Photo Ids
Given('an existing Photo Id {string}', function(v) {
  cy.world().then(world => {
    const photoList = getPhotoList().filter(photo => world.isChild(photo));
    const photo = getRandomElement(photoList);
    world.setVariable(v, photo.id);
  });
});
Given('an unknown Photo Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the Photo Id {string} of the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo } = world.getVariable(v2);
    world.setVariable(v1, photo.id);
  });
});
Given('the Album Id {string} of the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo } = world.getVariable(v2);
    world.setVariable(v1, photo.album_id);
  });
});
