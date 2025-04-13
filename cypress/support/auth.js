// *********************************************** UPPER BUTTONS ***********************************************

Cypress.Commands.add('getUpperRegistrationButton', () => {
    return cy.get('.space-x-2 > .text-textContent');
});

Cypress.Commands.add('getUpperLoginButton', () => {
    return cy.get('.space-x-2 > .text-buttonSubmitEnable');
});

// *********************************************** MAIN BUTTONS ***********************************************

Cypress.Commands.add('getMainRegistrationButton', () => {
    return cy.get('div.w-full > .space-y-4 > .mt-4 > .text-buttonSubmitEnable');
});

Cypress.Commands.add('getMainLoginButton', () => {
    return cy.get('div.w-full > .space-y-4 > .transition');
});

Cypress.Commands.add('getGoogleLoginButton', () => {
    return cy.get('div.w-full > .space-y-4 > .gap-3');
});

// *********************************************** VISUALS ***********************************************

Cypress.Commands.add('getHeader', () => {
    return cy.get('.mx-auto > .items-center');
});

Cypress.Commands.add('getGreeting', () => {
    return cy.get('.text-3xl');
});

Cypress.Commands.add('getPicture', () => {
    return cy.get('.p-6 > .darken');
});