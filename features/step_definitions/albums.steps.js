const { Given, When, Then } = require('cucumber');

const { getRandomElement, getAlbumList } = require('../../e2e/utils');

// Album list
When('I get the Album list', function() {
  const url = '/albums';
  this.request = supertest(this.getRoot())
    .get(url)
    .set(this.headers);
});

Then('I should get the complete Album list', async function() {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('array');
  const albumList = getAlbumList().filter(album => this.isChild(album));
  expect(this.response.body).to.have.lengthOf(albumList.length);
});

// Albums
Given('a new Album {string}', function(v) {
  const data = { title: 'Test album' };
  this.setVariable(v, { data });
});

When('I get the Album {string}', function(v) {
  const id = this.getVariable(v);
  const url = `/albums/${id}`;
  this.request = supertest(this.getRoot())
    .get(url)
    .set(this.headers);
});
When('I create the Album {string}', function(v) {
  const url = '/albums';
  const { data } = this.getVariable(v);
  this.request = supertest(this.getRoot())
    .post(url)
    .set(this.headers)
    .send(data);
});
When('I update the Album {string} with {string}', function(v1, v2) {
  const url = '/albums/' + this.getVariable(v1);
  const { data } = this.getVariable(v2);
  this.request = supertest(this.getRoot())
    .patch(url)
    .set(this.headers)
    .send(data);
});
When('I replace the Album {string} with {string}', function(v1, v2) {
  const url = '/albums/' + this.getVariable(v1);
  const { data } = this.getVariable(v2);
  this.request = supertest(this.getRoot())
    .put(url)
    .set(this.headers)
    .send(data);
});
When('I delete the Album {string}', function(v) {
  const url = '/albums/' + this.getVariable(v);
  this.request = supertest(this.getRoot())
    .delete(url)
    .set(this.headers);
});

Then('I should get the Album {string}', async function(v) {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  const {
    request: { url },
    body: data,
  } = this.response;
  this.setVariable(v, { url, data });
});
Then('the Album should be created as {string}', async function(v) {
  this.response = await this.request
    .expect(201)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  const {
    headers: { location: url },
    body: data,
  } = this.response;
  this.setVariable(v, { url, data });
});
Then('the Album should be updated as {string}', async function(v) {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  const {
    request: { url },
    body: data,
  } = this.response;
  this.setVariable(v, { url, data });
});
Then('the Album should be replaced as {string}', async function(v) {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  const {
    request: { url },
    body: data,
  } = this.response;
  this.setVariable(v, { url, data });
});
Then('the Album should not be created', async function() {
  this.response = await this.request.expect(500);
});

Then('the Album {string} should equal the Album {string}', function(v1, v2) {
  const { data: album1 } = this.getVariable(v1);
  const { data: album2 } = this.getVariable(v2);
  expect(album1)
    .excluding('id')
    .to.deep.equal(album2);
});
Then('the Album {string} should include the Album {string}', function(v1, v2) {
  const { data: album1 } = this.getVariable(v1);
  const { data: album2 } = this.getVariable(v2);
  expect(album1).to.include(album2);
});

// Album Ids
Given('an existing Album Id {string}', function(v) {
  const albumList = getAlbumList().filter(album => this.isChild(album));
  const album = getRandomElement(albumList);
  this.setVariable(v, album.id);
});
Given('an existing public Album Id {string}', function(v) {
  const albumList = getAlbumList().filter(
    album => this.isChild(album) && album.type === 'PUBLIC'
  );
  const album = getRandomElement(albumList);
  this.setVariable(v, album.id);
});
Given('an existing restricted Album Id {string}', function(v) {
  const albumList = getAlbumList().filter(
    album => this.isChild(album) && album.type === 'RESTRICTED'
  );
  const album = getRandomElement(albumList);
  this.setVariable(v, album.id);
});
Given('an existing private Album Id {string}', function(v) {
  const albumList = getAlbumList().filter(
    album => this.isChild(album) && album.type === 'PRIVATE'
  );
  const album = getRandomElement(albumList);
  this.setVariable(v, album.id);
});
Given('an unknown Album Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the Album Id {string} of the Album {string}', function(v1, v2) {
  const { data: album } = this.getVariable(v2);
  this.setVariable(v1, album.id);
});
Given('the User Id {string} of the Album {string}', function(v1, v2) {
  const { data: album } = this.getVariable(v2);
  this.setVariable(v1, album.user_id);
});
