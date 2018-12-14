/// <reference types="Cypress" />

describe('Server', () => {
  it('should be listening', () => {
    cy.request('/');
  });
});
