describe('login', () => {

    let user;
    beforeEach(() => {
        cy.fixture('users.json').then((users) => {
            user = users.userNatalia;
        });
        cy.visit('http://localhost:5173');
    });
    
    it ('Displays login form', () => {

        // Click on login button
        cy.getUpperLoginButton().click();

        // Ensure login form is visible
        cy.getEmailLabel().should('have.text', 'Email');
        cy.getEmailTextbox().should('exist');
        cy.getPasswordLabel().should('have.text', 'Password');
        cy.getPasswordTextbox().should('exist');
        cy.getForgotPasswordLink().should('have.text', 'Forgot password?');
        cy.getLoginFormButton().should('exist');

        // Enter valid credentials
        cy.getEmailTextbox().type(user.email);
        cy.getPasswordTextbox().type(user.password);
        
        // Click on form button
        cy.getLoginFormButton().click();

        // Assert that feed is now displayed
        cy.url().should('include', '/feed');
    })
})