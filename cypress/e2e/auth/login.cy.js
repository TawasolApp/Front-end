describe('login', () => {

    let user;
    beforeEach(() => {
        cy.fixture('users.json').then((users) => {
            user = users.userNatalia;
        });
        cy.visit('http://localhost:5173');

        // Click on login button
        cy.getUpperLoginButton().click();

        // Ensure login form is visible
        cy.getEmailLabel().should('have.text', 'Email');
        cy.getEmailTextbox().should('exist');
        cy.getPasswordLabel().should('have.text', 'Password');
        cy.getPasswordTextbox().should('exist');
        cy.getForgotPasswordLink().should('have.text', 'Forgot password?');
        cy.getLoginFormButton().should('exist');
    });
    
    it ('Logs in successfully', () => {

        // Enter valid credentials
        cy.getEmailTextbox().type(user.email);
        cy.getPasswordTextbox().type(user.password);
        
        // Click on form button
        cy.getLoginFormButton().click();

        // Assert that feed is now displayed
        cy.url().should('include', '/feed');
    })

    it ('Does not log in due to incorrect email', () => {

        // Enter incorrect credentials (incorrect email)
        cy.getEmailTextbox().type("incorrect_email@gmail.com");
        cy.getPasswordTextbox().type(user.password);
        
        // Click on form button
        cy.getLoginFormButton().click();

        // Assert login failure
        cy.url().should('include', '/auth/signin');
        cy.get('.text-red-500').should('have.text', 'Invalid email or password.');
    })

    it ('Does not log in due to incorrect password', () => {

        // Enter incorrect credentials (incorrect email)
        cy.getEmailTextbox().type(user.email);
        cy.getPasswordTextbox().type("incorrect_password");
        
        // Click on form button
        cy.getLoginFormButton().click();

        // Assert login failure
        cy.url().should('include', '/auth/signin');
        cy.get('.text-red-500').should('have.text', 'Invalid email or password.');
    })

    it ('Does not log in due to empty email', () => {

        // Enter incorrect credentials (empty email)
        cy.getPasswordTextbox().type(user.password);
        
        // Click on form button
        cy.getLoginFormButton().click();

        // Assert login failure
        cy.url().should('include', '/auth/signin');
    })

    it ('Does not log in due to empty password', () => {

        // Enter incorrect credentials (empty password)
        cy.getPasswordTextbox().type(user.email);
        
        // Click on form button
        cy.getLoginFormButton().click();

        // Assert login failure
        cy.url().should('include', '/auth/signin');
    })
})