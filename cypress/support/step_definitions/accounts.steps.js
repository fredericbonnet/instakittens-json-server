const { Given } = require('cypress-cucumber-preprocessor/steps');

const { getAccount } = require('../utils');

Given('I am not identified', function() {
  cy.world().then(world => {
    world.account = {};
    world.options = {};
  });
});
Given('I am identified', function() {
  cy.world().then(world => {
    world.options = { auth: world.account };
  });
});
Given('I am an unknown user', function() {
  cy.world().then(world => {
    world.account = { username: 'unknown', password: 'unknown' };
  });
});
Given('I am a registered user', function() {
  cy.world().then(world => {
    cy.fixture('test-accounts.json').then(accounts => {
      global.accounts = accounts;
      world.account = getAccount('user');
    });
  });
});
Given('I am an administrator', function() {
  cy.world().then(world => {
    cy.fixture('test-accounts.json').then(accounts => {
      global.accounts = accounts;
      world.account = getAccount('admin');
    });
  });
});
