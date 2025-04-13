describe('visit website', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173');

  });

  it('Displays upper buttons', () => {
    cy.getUpperRegistrationButton().should('exist');
    cy.getUpperLoginButton().should('exist');
  })

  it('Displays main buttons', () => {
    cy.getMainRegistrationButton().should('exist');
    cy.getMainLoginButton().should('exist');
    cy.getGoogleLoginButton().should('exist');
  })

  it('Displays header, greetings, and picture', () => {
    cy.getHeader().should('exist');
    cy.getGreeting().should('have.text', 'Welcome to your professional community');
    cy.getPicture().should('exist');
  })
})