const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Then('the operation is unauthorized', function() {
  cy.get('@response')
    .its('status')
    .should('equal', 401);
});
Then('the operation is forbidden', function() {
  cy.get('@response')
    .its('status')
    .should('equal', 403);
});
Then('the operation fails', function() {
  cy.get('@response')
    .its('status')
    .should('equal', 500);
});
Then('the resource should not be found', function() {
  cy.get('@response')
    .its('status')
    .should('equal', 404);
});
Then('the resource should be deleted', function() {
  cy.get('@response')
    .its('status')
    .should('equal', 200);
});

Then('the Id {string} should equal the Id {string}', function(v1, v2) {
  cy.world().then(world => {
    const id1 = world.getVariable(v1);
    const id2 = world.getVariable(v2);
    expect(id1).to.equal(id2);
  });
});
