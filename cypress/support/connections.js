Cypress.Commands.add("searchUser", (user) => {
  cy.intercept("GET", "**/posts/search/?**").as("searchPosts");
  cy.getNavbarSearch().type(user + "{enter}");
  cy.wait("@searchPosts").its("response.statusCode").should("eq", 200);
  cy.getSearchDropdown().click();
  cy.getSearchDropdownPeople().click();
  cy.getSearchPeople().first().click();
});

Cypress.Commands.add("getSearchPeople", () => {
  return cy.get('[data-testid="searchUserName"]');
});

Cypress.Commands.add("connectOrRemove", () => {
  return cy.get('[data-testid="connect-button"]');
});

Cypress.Commands.add("getConfirmConnectionButton", () => {
  return cy.get('[data-testid="confirm-modal"]');
});

Cypress.Commands.add("getFollowButton", () => {
  return cy.get('[data-testid="follow-button"]');
});

Cypress.Commands.add("getUnfollowButton", () => {
  return cy.get('[aria-label="Unfollow user"]');
});

Cypress.Commands.add("getConnectionList", () => {
  return cy.get('[data-testid="connections"]');
});

Cypress.Commands.add("getFollowingList", () => {
  return cy.get('[data-testid="following"]');
});

Cypress.Commands.add("getBlockedList", () => {
  return cy.get('[data-testid="blocked"]');
});

Cypress.Commands.add("getConnectionsCount", () => {
  return cy.get(".text-xl");
});

Cypress.Commands.add("getConnectionPerson", () => {
  return cy.get('[data-testid="connections-card"]');
});
