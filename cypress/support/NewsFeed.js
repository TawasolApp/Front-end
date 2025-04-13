// *********************************************** LEFT SIDEBAR ***********************************************

Cypress.Commands.add('getLeftSideBar', () => {
    return cy.get('[data-testid="LeftSideBar"]');
  });

Cypress.Commands.add('getLeftSideBarName', () => {
  return cy.get('[data-testid="LeftSideBarName"]');
});

Cypress.Commands.add('getLeftSideBarBio', () => {
  return cy.get('[data-testid="LeftSideBarBio"]');
});

Cypress.Commands.add('getLeftSideBarPremium', () => {
  return cy.get('[data-testid="LeftSideBarPremium"]');
});

Cypress.Commands.add('getLeftSideBarSavedItems', () => {
  return cy.get('[data-testid="LeftSideBarSavedItems"]');
});


// *********************************************** NAVBAR ***********************************************
// Navbar commands
Cypress.Commands.add('getNavbar', () => {
  return cy.get('[data-testid="navbar"]');
});

Cypress.Commands.add('getNavbarSearch', () => {
  return cy.get('[data-testid="navbarSearch"]');
});

// Navigation items
Cypress.Commands.add('getNavbarHome', () => {
  return cy.get('[data-testid="navbar-Home"]');
});

Cypress.Commands.add('getNavbarMyNetwork', () => {
  return cy.get('[data-testid="navbar-My Network"]');
});

Cypress.Commands.add('getNavbarJobs', () => {
  return cy.get('[data-testid="navbar-Jobs"]');
});

Cypress.Commands.add('getNavbarMessaging', () => {
  return cy.get('[data-testid="navbar-Messaging"]');
});

Cypress.Commands.add('getNavbarNotifications', () => {
  return cy.get('[data-testid="navbar-Notifications"]');
});

// Me dropdown commands
Cypress.Commands.add('getNavbarMe', () => {
  return cy.get('[data-testid="navbar-me"]');
});

Cypress.Commands.add('getNavbarMeDropdown', () => {
  return cy.get('[data-testid="navbar-me-dropdown"]');
});

Cypress.Commands.add('getNavbarMeDropdownProfile', () => {
  return cy.get('[data-testid="navbar-me-dropdown-profile"]');
});

Cypress.Commands.add('getNavbarMeDropdownSettings', () => {
  return cy.get('[data-testid="navbar-me-dropdown-settings"]');
});

Cypress.Commands.add('getNavbarMeDropdownSignOut', () => {
  return cy.get('[data-testid="navbar-me-dropdown-SignOut"]');
});

// *********************************************** POSTS ***********************************************

// Post elements
Cypress.Commands.add('getPost', () => {
  return cy.get('[data-testid="post"]');
});

Cypress.Commands.add('getPostComment', () => {
  return cy.get('[data-testid="postComment"]');
});

Cypress.Commands.add('getPostReact', () => {
  return cy.get('[data-testid="postReact"]');
});

Cypress.Commands.add('getPostRepost', () => {
  return cy.get('[data-testid="postRepost"]');
});

Cypress.Commands.add('getPostSend', () => {
  return cy.get('[data-testid="postSend"]');
});

Cypress.Commands.add('getPostEllipsis', () => {
  return cy.get('[data-testid="postEllipsis"]');
});


// Post ellipsis menu options
Cypress.Commands.add('getPostEllipsis', () => {
  return cy.get('[data-testid="postEllipsis"]');
});

Cypress.Commands.add('getPostEllipsisDelete', () => {
  return cy.get('[data-testid="postEllipsis-delete-post"]');
});

Cypress.Commands.add('getPostEllipsisEdit', () => {
  return cy.get('[data-testid="postEllipsis-edit-post"]');
});

Cypress.Commands.add('getPostEllipsisReport', () => {
  return cy.get('[data-testid="postEllipsis-report-post"]');
});

Cypress.Commands.add('getPostEllipsisSave', () => {
  return cy.get('[data-testid="postEllipsis-save-post"]');
});

Cypress.Commands.add('getPostEllipsisCopyLink', () => {
  return cy.get('[data-testid="postEllipsis-copy-link-to-post"]');
});