const { Given, When, Then } = require('cucumber');

const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
const { expect } = chai;
const supertest = require('supertest');
const { getRandomElement, getPhotoList } = require('../../e2e/utils');

// Photo list
When('I get the Photo list', function() {
  const url = '/photos';
  this.request = supertest(this.getRoot())
    .get(url)
    .set(this.headers);
});

Then('I should get the complete Photo list', async function() {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('array');
  const photoList = getPhotoList().filter(photo => this.isChild(photo));
  expect(this.response.body).to.have.lengthOf(photoList.length);
});

// Photos
Given('a new Photo {string}', function(v) {
  const data = { title: 'Test photo' };
  this.setVariable(v, { data });
});

When('I get the Photo {string}', function(v) {
  const id = this.getVariable(v);
  const url = `/photos/${id}`;
  this.request = supertest(this.getRoot())
    .get(url)
    .set(this.headers);
});
When('I create the Photo {string}', function(v) {
  const url = '/photos';
  const { data } = this.getVariable(v);
  this.request = supertest(this.getRoot())
    .post(url)
    .set(this.headers)
    .send(data);
});
When('I update the Photo {string} with {string}', function(v1, v2) {
  const url = '/photos/' + this.getVariable(v1);
  const { data } = this.getVariable(v2);
  this.request = supertest(this.getRoot())
    .patch(url)
    .set(this.headers)
    .send(data);
});
When('I replace the Photo {string} with {string}', function(v1, v2) {
  const url = '/photos/' + this.getVariable(v1);
  const { data } = this.getVariable(v2);
  this.request = supertest(this.getRoot())
    .put(url)
    .set(this.headers)
    .send(data);
});
When('I delete the Photo {string}', function(v) {
  const url = '/photos/' + this.getVariable(v);
  this.request = supertest(this.getRoot())
    .delete(url)
    .set(this.headers);
});

Then('I should get the Photo {string}', async function(v) {
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
Then('the Photo should be created as {string}', async function(v) {
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
Then('the Photo should be updated as {string}', async function(v) {
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
Then('the Photo should be replaced as {string}', async function(v) {
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
Then('the Photo should not be created', async function() {
  this.response = await this.request.expect(500);
});

Then('the Photo {string} should equal the Photo {string}', function(v1, v2) {
  const { data: photo1 } = this.getVariable(v1);
  const { data: photo2 } = this.getVariable(v2);
  expect(photo1)
    .excluding('id')
    .to.deep.equal(photo2);
});
Then('the Photo {string} should include the Photo {string}', function(v1, v2) {
  const { data: photo1 } = this.getVariable(v1);
  const { data: photo2 } = this.getVariable(v2);
  expect(photo1).to.include(photo2);
});

// Photo Ids
Given('an existing Photo Id {string}', function(v) {
  const photoList = getPhotoList().filter(photo => this.isChild(photo));
  const photo = getRandomElement(photoList);
  this.setVariable(v, photo.id);
});
Given('an unknown Photo Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the Photo Id {string} of the Photo {string}', function(v1, v2) {
  const { data: photo } = this.getVariable(v2);
  this.setVariable(v1, photo.id);
});
Given('the Album Id {string} of the Photo {string}', function(v1, v2) {
  const { data: photo } = this.getVariable(v2);
  this.setVariable(v1, photo.album_id);
});
