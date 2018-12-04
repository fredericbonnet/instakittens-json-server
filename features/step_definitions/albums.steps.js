const { Given, When, Then } = require('cucumber');

const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
const { expect } = chai;
const supertest = require('supertest');
const { getRandomElement, getAlbumList } = require('../../e2e/utils');

// Album list
When('I get the Album list', function() {
  const url = '/albums';
  this.request = supertest(global.url)
    .get(url)
    .set(this.headers);
});

Then('I should get the complete Album list', async function() {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('array');
  expect(this.response.body).to.have.lengthOf(getAlbumList().length);
});

// Albums
Given('a new Album {string}', function(v) {
  const data = { title: 'Test album' };
  this.setVariable(v, data);
});

When('I get the Album {string}', function(v) {
  const id = this.getVariable(v);
  const url = `/albums/${id}`;
  this.request = supertest(global.url)
    .get(url)
    .set(this.headers);
});
When('I create the Album {string}', function(v) {
  const url = '/albums';
  const data = this.getVariable(v);
  this.request = supertest(global.url)
    .post(url)
    .set(this.headers)
    .send(data);
});
When('I update the Album {string} with {string}', function(v1, v2) {
  const url = '/albums/' + this.getVariable(v1);
  const data = this.getVariable(v2);
  this.request = supertest(global.url)
    .patch(url)
    .set(this.headers)
    .send(data);
});
When('I replace the Album {string} with {string}', function(v1, v2) {
  const url = '/albums/' + this.getVariable(v1);
  const data = this.getVariable(v2);
  this.request = supertest(global.url)
    .put(url)
    .set(this.headers)
    .send(data);
});
When('I delete the Album {string}', function(v) {
  const url = '/albums/' + this.getVariable(v);
  this.request = supertest(global.url)
    .delete(url)
    .set(this.headers);
});

Then('I should get the Album {string}', async function(v) {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  this.setVariable(v, this.response.body);
});
Then('the Album should be created as {string}', async function(v) {
  this.response = await this.request
    .expect(201)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  this.setVariable(v, this.response.body);
});
Then('the Album should be updated as {string}', async function(v) {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  this.setVariable(v, this.response.body);
});
Then('the Album should be replaced as {string}', async function(v) {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('object');
  this.setVariable(v, this.response.body);
});
Then('the Album should not be created', async function() {
  this.response = await this.request.expect(500);
});

Then('the Album {string} should equal the Album {string}', function(v1, v2) {
  const album1 = this.getVariable(v1);
  const album2 = this.getVariable(v2);
  expect(album1)
    .excluding('id')
    .to.deep.equal(album2);
});
Then('the Album {string} should include the Album {string}', function(v1, v2) {
  const album1 = this.getVariable(v1);
  const album2 = this.getVariable(v2);
  expect(album1).to.include(album2);
});

// Album Ids
Given('an existing Album Id {string}', function(v) {
  const album = getRandomElement(db.albums);
  this.setVariable(v, album.id);
});
Given('an unknown Album Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the Album Id {string} of the Album {string}', function(v1, v2) {
  const album = this.getVariable(v2);
  this.setVariable(v1, album.id);
});

Then('the Album Id {string} should equal the Album Id {string}', function(
  v1,
  v2
) {
  const id1 = this.getVariable(v1);
  const id2 = this.getVariable(v2);
  expect(id1).to.equal(id2);
});
