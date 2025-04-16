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

    it('User1 Connects User3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.connectOrRemove().should('contain', 'Connect').click(); 
        cy.connectOrRemove().should('contain', 'Pending');
        cy.wait(1000);
    });

    it('User3 Accepts User1', () => {
        cy.login(user3);
        cy.searchUser(user1.first_name);
        cy.get('.capitalize').should('contain', 'Accept').click();
        cy.getConfirmConnectionButton().click();
        cy.wait(1000);
        cy.get('.capitalize').should('contain', 'Connected')
        cy.wait(1000);
    });

    it('User1 removes User3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.connectOrRemove().should('contain', 'Connected').click(); 
        cy.connectOrRemove().should('contain', 'Connect');
        cy.wait(1000);
    });

    it('User1 Follows user3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.getFollowButton().should('have.text', '+ Follow').click(); 
        cy.wait(1000);
        cy.getUnfollowButton().should('have.text', '✓ Following')
    });

    //Fails error: DELETE 404
    it('User1 Unfollows user3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.getUnfollowButton().click();
        cy.getConfirmConnectionButton().click({force: true});
        cy.wait(1000);
        cy.getFollowButton().should('have.text', '+ Follow');
    });

    it('shows connection list', () => {
        cy.login(user3);
        cy.getNavbarMyNetwork().click();
        cy.getConnectionList().should('contain', 'Connections').click();
        cy.getConnectionsCount().should('contain', '2 Connections');
    });

    it('User1 Connects User3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.connectOrRemove().should('contain', 'Connect').click(); 
        cy.connectOrRemove().should('contain', 'Pending');
        cy.wait(1000);
    });

    it('User3 Accepts User1', () => {
        cy.login(user3);
        cy.searchUser(user1.first_name);
        cy.get('.capitalize').should('contain', 'Accept').click();
        cy.getConfirmConnectionButton().click();
        cy.wait(1000);
        cy.get('.capitalize').should('contain', 'Connected')
        cy.wait(1000);
    });

    it('user3 shows connection list', () => {
        cy.login(user3);
        cy.getNavbarMyNetwork().click();
        cy.getConnectionList().should('contain', 'Connections').click();
        cy.getConnectionsCount().should('contain', '3 Connections');
    });


    it('User1 removes User3', () => {
        cy.login(user1);
        cy.searchUser(user3.first_name);
        cy.connectOrRemove().should('contain', 'Connected').click(); 
        cy.connectOrRemove().should('contain', 'Connect');
        cy.wait(1000);
    });

    it('user3 shows connection list', () => {
        cy.login(user3);
        cy.getNavbarMyNetwork().click();
        cy.getConnectionList().should('contain', 'Connections').click();
        cy.getConnectionsCount().should('contain', '2 Connections');
    });

});