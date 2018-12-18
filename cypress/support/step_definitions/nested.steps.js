const { Given } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement, getUsersWithAlbums } = require('../utils');

Given('a User Id {string} with albums', function(v) {
  cy.world().then(world => {
    const user = getRandomElement(
      getUsersWithAlbums(),
      user => !world.account || user.id !== world.account.userId
    );
    world.setVariable(v, user.id);
  });
});

Given('I open the User {string}', function(v) {
  cy.world().then(world => {
    const user = world.getVariable(v);
    world.setParent('user_id', user);
  });
});
Given('I open the Album {string}', function(v) {
  cy.world().then(world => {
    const album = world.getVariable(v);
    world.setParent('album_id', album);
  });
});
Given('I open the Photo {string}', function(v) {
  cy.world().then(world => {
    const photo = world.getVariable(v);
    world.setParent('photo_id', photo);
  });
});
