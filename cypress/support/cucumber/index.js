/*
 * Cucumber initialization.
 */
const { World } = require('./world');

/**
 * Register world object in Cucumber steps.
 */
Cypress.Commands.add('world', function() {
  if (this.world) {
    // Already registered.
    return this.world;
  }

  // Create new world object.
  this.world = new World();

  // Expose database in global context.
  cy.task('db').then(db => {
    global.db = db;
    return this.world;
  });
});
