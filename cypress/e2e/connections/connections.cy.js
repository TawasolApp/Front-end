describe('Connections', () => {
    let user1;
    let user2;
    let user3;
    beforeEach(() => {
        cy.fixture('users.json').then((users) => {
            user1 = users.userDallas;
            user2 = users.userTrevor;
            user3 = users.userPrice;
        });
        cy.visit('http://localhost:5173/feed');
    });

    it('User1 Connects User2', () => {
        cy.login(user1);
        cy.searchUser(user2.first_name);
        cy.connectOrRemove().should('contain', 'Connect').click(); 
        cy.connectOrRemove().should('contain', 'Pending');
    });

    it('User2 Accepts User1', () => {
        cy.login(user2);
        cy.searchUser(user1.first_name);
        cy.get('.capitalize').should('contain', 'Accept').click();
        cy.getConfirmConnectionButton().click();
        cy.wait(1000);
        cy.get('.capitalize').should('contain', 'Connected')
    });

    it('User1 removes User2', () => {
        cy.login(user1);
        cy.searchUser(user2.first_name);
        cy.connectOrRemove().should('contain', 'Connected').click(); 
        cy.connectOrRemove().should('contain', 'Connect');
    });

    it('User1 Follows/Unfollows User2', () => {
        cy.login(user1);
        cy.searchUser(user2.first_name);
        cy.getFollowButton().should('contain', 'Follow').click(); 
        cy.getUnfollowButton().should('contain', 'Following').click();
        cy.getConfirmConnectionButton().click();
    });

    it('shows connection list', () => {
        cy.login(user3);
        cy.getNavbarMyNetwork().click();
        cy.getConnectionList().should('contain', 'Connections').click();
        cy.getConnectionsCount().should('contain', '2 Connections');
    });

    it('User3 Connects and follows User1', () => {
        cy.login(user3);
        cy.searchUser(user1.first_name);
        cy.connectOrRemove().should('contain', 'Connect').click(); 
        cy.getFollowButton().should('contain', 'Follow').click(); 
        cy.connectOrRemove().should('contain', 'Pending');
    });

    it('User1 Accepts User3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.get('.capitalize').should('contain', 'Accept').click();
        cy.getConfirmConnectionButton().click();
        cy.wait(1000);
        cy.get('.capitalize').should('contain', 'Connected')
    });

    it('user3 shows connection list', () => {
        cy.login(user3);
        cy.getNavbarMyNetwork().click();
        cy.getConnectionList().should('contain', 'Connections').click();
        cy.getConnectionsCount().should('contain', '3 Connections');
    });


    it('User3 removes User1', () => {
        cy.login(user3);
        cy.searchUser(user1.first_name);
        cy.connectOrRemove().should('contain', 'Connected').click(); 
        cy.connectOrRemove().should('contain', 'Connect');
    });





});