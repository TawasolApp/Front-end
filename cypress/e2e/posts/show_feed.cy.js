describe('open news feed', () => {
  let user;
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      user = users.userDallas;
      cy.login(user);
    });
    cy.visit('http://localhost:5173/feed');
  });

  it('Displays left side bar', () => {
    cy.getLeftSideBar().should('exist');
    cy.getLeftSideBarName().should('exist');
    cy.getLeftSideBarBio().should('exist');
    cy.getLeftSideBarPremium().should('exist');
    cy.getLeftSideBarSavedItems().should('exist');
  });

  it('Displays Navbar', () => {
    cy.getNavbar().should('exist');
    cy.getNavbarSearch().should('exist');
    cy.getNavbarHome().should('exist');
    cy.getNavbarMyNetwork().should('exist');
    cy.getNavbarJobs().should('exist');
    cy.getNavbarMessaging().should('exist');
    cy.getNavbarNotifications().should('exist');
  });
  
  it('Displays Me dropdown', () => {
    cy.getNavbarMe().click();
    cy.getNavbarMeDropdown().should('exist');
    cy.getNavbarMeDropdownProfile().should('exist');
    cy.getNavbarMeDropdownSettings().should('exist');
    cy.getNavbarMeDropdownSignOut().should('exist');
  });

  // Post interaction tests
  describe('Post interactions', () => {
    beforeEach(() => {
      cy.getPost().first().as('firstPost');
    });

    it('Shows post interaction buttons', () => {
      cy.get('@firstPost').within(() => {
        cy.getPostReact().should('exist');
        cy.getPostCommentShow().should('exist');
        cy.getPostRepost().should('exist');
        cy.getPostSend().should('exist');
      });
    });

    it('Shows post ellipsis menu options', () => {
      cy.get('@firstPost').within(() => {
        cy.getPostEllipsis().click();
        cy.getPostEllipsisReport().should('exist');
        cy.getPostEllipsisSave().should('exist');
        cy.getPostEllipsisCopyLink().should('exist');
      });
    });

    it('Show post buttons', () => {
      cy.get('@firstPost').within(() => {
        cy.getPostReact().should('exist');
        cy.getPostCommentShow().should('exist');
        cy.getPostRepost().should('exist');
        cy.getPostSend().should('exist');
      });
    });
  });
});