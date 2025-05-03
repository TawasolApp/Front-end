Cypress.Commands.add("getMessagesPage", () => {
  return cy.get('[data-testid="navbar-Messaging"]');
});

Cypress.Commands.add("getSearchDropDownPeople", () => {
  return cy.get('[data-testid="SearchDropdownOption-people"]');
});

Cypress.Commands.add("getPeopleFirstSearchResult", () => {
  return cy.get('[data-testid="searchUserName"]');
});

Cypress.Commands.add("getMessageUserButton", () => {
  return cy.get(".bg-blue-600");
});

Cypress.Commands.add("getMessageAreaInput", () => {
  return cy.get(".p-3 > .w-full");
});

Cypress.Commands.add("getMessageSendButton", () => {
  return cy.get(".justify-between > .px-3");
});

Cypress.Commands.add("getFirstChat", () => {
  return cy.get(
    ".w-2\\/5 > :nth-child(1) > :nth-child(1) > .items-start > .flex-1 > .justify-between > .py-1 > .font-medium"
  );
});

Cypress.Commands.add("getMessageContent", () => {
  return cy.get(".w-3\\/5 > .flex-col > .flex-1 > .max-w-xs > :nth-child(1)");
});

Cypress.Commands.add("getSendImageButton", () => {
  return cy.get('[title="Add image"] input[type="file"]');
});

Cypress.Commands.add("getSentImageSrc", () => {
  return cy.get('img[alt="Message media"]').invoke("attr", "src");
});

Cypress.Commands.add("getUnseenMessagesCount", () => {
  return cy.get(
    ".w-2\\/5 > :nth-child(1) > :nth-child(1) > .items-start > .flex-1 > .justify-between > .flex-col > .flex"
  );
});

Cypress.Commands.add("getSenderAvatar", () => {
  return cy.get(".mr-3 > .MuiAvatar-root");
});

Cypress.Commands.add("getHoveredSenderAvatar", () => {
  return cy.get('.mr-3 > .absolute');
});

Cypress.Commands.add("getMarkAsReadButton", () => {
  return cy.get('[aria-label="Mark as read"]');
});

Cypress.Commands.add("getMarkAsUnreadButton", () => {
  return cy.get('[aria-label="Mark as unread"]');
});

Cypress.Commands.add("getSentIcon", () => {
  return cy.get('[data-testid="DoneIcon"]');
});

Cypress.Commands.add("getDeliveredIcon", () => {
  return cy.get('.w-3\\/5 > .flex-col > .flex-1 > .max-w-xs > .flex > [title="Delivered"] > [data-testid="DoneAllIcon"]');
});

Cypress.Commands.add("getReadIcon", () => {
  return cy.get('.w-3\\/5 > .flex-col > .flex-1 > .max-w-xs > .flex > [title="Read"] > [data-testid="DoneAllIcon"]');
});