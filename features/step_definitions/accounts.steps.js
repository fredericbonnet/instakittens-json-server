const { Given } = require('cucumber');
const { buildHeader, getAccount } = require('../../e2e/utils');

Given('I am not identified', function() {
  this.account = undefined;
  this.headers = {};
});
Given('I am identified', function() {
  this.headers = {
    authorization: buildHeader(this.account.username, this.account.password),
  };
});
Given('I am an unknown user', function() {
  this.account = { username: 'unknown', password: 'unknown' };
});
Given('I am a registered user', function() {
  this.account = getAccount('user');
});
Given('I am an administrator', function() {
  this.account = getAccount('admin');
});
