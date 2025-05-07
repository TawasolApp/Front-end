describe('open news feed', () => {
    beforeEach(() => {
      cy.fixture('users.json').then((users) => {
        cy.login(users.userDallas);
      });
      cy.visit('http://localhost:5173/feed');
    });

    // SHOULD BE MOCKED

    describe('Notifications Creation', () => {
        it('Open Alphonso Profile and trigger notifications', () => {
            cy.visit('http://localhost:5173/search/Alphonso');
            cy.getSearchDropDownMenu().click();
            cy.getSearchDropdownPeople().click();
            cy.getSearchPeople().first().click();
            cy.wait(1000);
            cy.get('.capitalize').first().click(); // Send connection request
            cy.wait(1000);
            cy.get('[data-testid="main-like-button"]').first().click(); // Click on the like
            cy.wait(1000);
            cy.get('.grid-cols-4 > :nth-child(2)').first().click(); // Click on the comment button
            cy.get('.flex-1 > .relative > .w-full').type('Test comment'); // Type a comment
            cy.get('.absolute > .px-3').click(); // Click on the send button
            cy.wait(5000);
        });
    });

    describe('View Notifcations', () => {
        it('View Notifications after logging in alphonso', () => {
            cy.fixture('users.json').then((users) => {
                cy.login(users.userAlphonso);
              });
              cy.visit('http://localhost:5173/notifications');
              cy.get('.flex > .MuiBadge-root > .MuiBadge-badge').should('have.text', '8');
            });
    });

    describe('Notifications Removal', () => {
        it('Open Alphonso Profile and trigger notifications removal', () => {
            cy.visit('http://localhost:5173/search/Alphonso');
            cy.getSearchDropDownMenu().click();
            cy.getSearchDropdownPeople().click();
            cy.getSearchPeople().first().click();
            cy.get('.capitalize').first().click(); // Send connection request
            cy.wait(1000);
            cy.get('[data-testid="main-like-button"]').first().click(); // Click on the like
            cy.wait(1000);
        });
    });

    describe('View Notifcations', () => {
        it('View Notifications after logging in alphonso', () => {
            cy.fixture('users.json').then((users) => {
                cy.login(users.userAlphonso);
              });
              cy.visit('http://localhost:5173/notifications');
              cy.get('.flex > .MuiBadge-root > .MuiBadge-badge').should('have.text', '7');
        });
    });


});