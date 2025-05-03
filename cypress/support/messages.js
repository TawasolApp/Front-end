Cypress.Commands.add('getMessagesPage', () => {
    return cy.get('[data-testid="navbar-Messaging"]');
});

Cypress.Commands.add("getSearchDropDownPeople", () => {
    return cy.get('[data-testid="SearchDropdownOption-people"]');
  });

  Cypress.Commands.add("getPeopleFirstSearchResult", () => {
    return cy.get('[data-testid="searchUserName"]');
  });

  Cypress.Commands.add("getMessageUserButton", () => {
    return cy.get('.bg-blue-600');
  });

  Cypress.Commands.add("getMessageAreaInput", () => {
    return cy.get('.p-3 > .w-full');
  });

  Cypress.Commands.add("getMessageSendButton", () => {
    return cy.get('.justify-between > .px-3');
  });
