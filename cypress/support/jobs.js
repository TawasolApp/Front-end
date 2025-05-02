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

Cypress.Commands.add("getJobsPage", () => {
  return cy.get('[data-testid="navbar-Jobs"]');
});

Cypress.Commands.add("getExperienceLevelFilter", () => {
  return cy.get("#experience-level");
});

Cypress.Commands.add("getMinSalaryFilter", () => {
  return cy.get("#min-salary");
});

Cypress.Commands.add("getMaxSalaryFilter", () => {
  return cy.get("#max-salary");
});

Cypress.Commands.add("getCompanyFilter", () => {
  return cy.get("#company-search");
});

Cypress.Commands.add("getJobSaveButton", () => {
  return cy.get('.mb-8 > .border');
});

Cypress.Commands.add("getHome", () => {
  return cy.get('[data-testid="navbar-Home"]');
});

Cypress.Commands.add("getSavedItems", () => {
  return cy.get('[data-testid="LeftSideBarSavedItems"]');
});

Cypress.Commands.add("getSavedJobs", () => {
  return cy.get('[href="/my-items/saved-jobs"] > .flex > .text-xs');
});

Cypress.Commands.add("getFirstSavedJob", () => {
  return cy.get('.group > .flex-1 > :nth-child(1) > .text-lg');
});