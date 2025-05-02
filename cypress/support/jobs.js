Cypress.Commands.add("getSearchBar", () => {
  return cy.get('[data-testid="navbarSearch"]');
});

Cypress.Commands.add("getSearchDropDownMenu", () => {
  return cy.get('[data-testid="SearchDropdown"] > .text-xs');
});

Cypress.Commands.add("getSearchDropDownJobs", () => {
  return cy.get('[data-testid="SearchDropdownOption-jobs"]');
});

Cypress.Commands.add("getJobsSearchResults", () => {
  return cy.get(".group");
});

Cypress.Commands.add("getJobsFirstSearchResult", () => {
  return cy.get(".group > .flex-1 > :nth-child(1) > .text-lg");
});

Cypress.Commands.add("getIndustryFilter", () => {
  return cy.get('[placeholder="Industry"]');
});

Cypress.Commands.add("getLocationFilter", () => {
  return cy.get('[placeholder="Location"]');
});