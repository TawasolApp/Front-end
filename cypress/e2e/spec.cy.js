describe('example', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.text-3xl').should('have.text', 'Welcome to your professional community');
  })
})