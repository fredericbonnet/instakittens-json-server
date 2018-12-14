const { Given, When, Then } = require('cucumber');

const { getRandomElement, getUserList } = require('../../e2e/utils');

// User list
When('I get the User list', function() {
  const url = '/users';
  this.request = supertest(global.url)
    .get(url)
    .set(this.headers);
});

Then('I should get the complete User list', async function() {
  this.response = await this.request
    .expect(200)
    .expect('content-type', /^application\/json;?/);
  expect(this.response.body).to.be.an('array');
  expect(this.response.body).to.have.lengthOf(getUserList().length);
});

// Users
Given('a new User {string}', function(v) {
  const data = { username: 'test_user' };
  this.setVariable(v, { data });
});

When('I get the User {string}', function(v) {
  const id = this.getVariable(v);
  const url = `/users/${id}`;
  this.request = supertest(global.url)
    .get(url)
    .set(this.headers);
});
When('I create the User {string}', function(v) {
  const url = '/users';
  const { data } = this.getVariable(v);
  this.request = supertest(global.url)
    .post(url)
    .set(this.headers)
    .send(data);
});
When('I update the User {string} with {string}', function(v1, v2) {
  const url = '/users/' + this.getVariable(v1);
  const { data } = this.getVariable(v2);
  this.request = supertest(global.url)
    .patch(url)
    .set(this.headers)
    .send(data);
});
When('I replace the User {string} with {string}', function(v1, v2) {
  const url = '/users/' + this.getVariable(v1);
  const { data } = this.getVariable(v2);
  this.request = supertest(global.url)
    .put(url)
    .set(this.headers)
    .send(data);
});
When('I delete the User {string}', function(v) {
  const url = '/users/' + this.getVariable(v);
  this.request = supertest(global.url)
    .delete(url)
    .set(this.headers);
});

Then('I should get the User {string}', async function(v) {
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
Then('the User should be created as {string}', async function(v) {
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
Then('the User should be updated as {string}', async function(v) {
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
Then('the User should be replaced as {string}', async function(v) {
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
Then('the User should not be created', async function() {
  this.response = await this.request.expect(500);
});

Then('the User {string} should equal the User {string}', function(v1, v2) {
  const { data: user1 } = this.getVariable(v1);
  const { data: user2 } = this.getVariable(v2);
  expect(user1)
    .excluding('id')
    .to.deep.equal(user2);
});
Then('the User {string} should include the User {string}', function(v1, v2) {
  const { data: user1 } = this.getVariable(v1);
  const { data: user2 } = this.getVariable(v2);
  expect(user1).to.include(user2);
});

// User Ids
Given('an existing User Id {string}', function(v) {
  const user = getRandomElement(
    getUserList(),
    user => !this.account || user.id !== this.account.userId
  );
  this.setVariable(v, user.id);
});
Given('an unknown User Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the User Id {string} of the User {string}', function(v1, v2) {
  const { data: user } = this.getVariable(v2);
  this.setVariable(v1, user.id);
});
