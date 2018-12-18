const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement, getAlbumList } = require('../utils');

// Album list
When('I get the Album list', function() {
  cy.world().then(world => {
    const url = world.getRoot() + '/albums';
    cy.request({
      ...world.options,
      method: 'GET',
      url,
      failOnStatusCode: false,
    }).as('response');
  });
});

Then('I should get the complete Album list', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.match(/^application\/json;?/);
      expect(response.body).to.be.an('array');
      const albumList = getAlbumList().filter(album => world.isChild(album));
      expect(response.body).to.have.lengthOf(albumList.length);
    });
  });
});

// Albums
Given('a new Album {string}', function(v) {
  cy.world().then(world => {
    const data = { title: 'Test album' };
    world.setVariable(v, { data });
  });
});

When('I get the Album {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = world.getRoot() + `/albums/${id}`;
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
When('I create the Album {string}', function(v) {
  cy.world().then(world => {
    const url = world.getRoot() + '/albums';
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
When('I update the Album {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = world.getRoot() + '/albums/' + world.getVariable(v1);
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
When('I replace the Album {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const url = world.getRoot() + '/albums/' + world.getVariable(v1);
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
When('I delete the Album {string}', function(v) {
  cy.world().then(world => {
    const url = world.getRoot() + '/albums/' + world.getVariable(v);
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

Then('I should get the Album {string}', function(v) {
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
Then('the Album should be created as {string}', function(v) {
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
Then('the Album should be updated as {string}', function(v) {
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
Then('the Album should be replaced as {string}', function(v) {
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
Then('the Album should not be created', function() {
  cy.world().then(world => {
    cy.get('@response').then(response => {
      expect(response.status).to.eq(500);
    });
  });
});

Then('the Album {string} should equal the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album1 } = world.getVariable(v1);
    const { data: album2 } = world.getVariable(v2);
    expect(album1)
      .excluding('id')
      .to.deep.equal(album2);
  });
});
Then('the Album {string} should include the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album1 } = world.getVariable(v1);
    const { data: album2 } = world.getVariable(v2);
    expect(album1).to.include(album2);
  });
});

// Album Ids
Given('an existing Album Id {string}', function(v) {
  cy.world().then(world => {
    const albumList = getAlbumList().filter(album => world.isChild(album));
    const album = getRandomElement(albumList);
    world.setVariable(v, album.id);
  });
});
Given('an existing public Album Id {string}', function(v) {
  cy.world().then(world => {
    const albumList = getAlbumList().filter(
      album => world.isChild(album) && album.type === 'PUBLIC'
    );
    const album = getRandomElement(albumList);
    world.setVariable(v, album.id);
  });
});
Given('an existing restricted Album Id {string}', function(v) {
  cy.world().then(world => {
    const albumList = getAlbumList().filter(
      album => world.isChild(album) && album.type === 'RESTRICTED'
    );
    const album = getRandomElement(albumList);
    world.setVariable(v, album.id);
  });
});
Given('an existing private Album Id {string}', function(v) {
  cy.world().then(world => {
    const albumList = getAlbumList().filter(
      album => world.isChild(album) && album.type === 'PRIVATE'
    );
    const album = getRandomElement(albumList);
    world.setVariable(v, album.id);
  });
});
Given('an unknown Album Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the Album Id {string} of the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album } = world.getVariable(v2);
    world.setVariable(v1, album.id);
  });
});
Given('the User Id {string} of the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album } = world.getVariable(v2);
    world.setVariable(v1, album.user_id);
  });
});
