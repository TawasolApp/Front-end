Cypress.Commands.add("getProfileMoreButton", () => {
    return cy.get('.relative > .h-8');
});

Cypress.Commands.add("getBlockOrReportButton", () => {
    return cy.get('.absolute > .flex');
});

Cypress.Commands.add("getBlockButton", () => {
    return cy.get('[data-testid="report-block-modal"] > .bg-boxbackground > .space-y-1 > :nth-child(1)');
});

Cypress.Commands.add("getBlockConfirmationButton", () => {
    return cy.get('[data-testid="confirm-modal"]');
});

Cypress.Commands.add("getReportButton", () => {
    return cy.get('[data-testid="report-block-modal"] > .bg-boxbackground > .space-y-1 > :nth-child(2)');
});

Cypress.Commands.add("goToProfile", () => {
    cy.get('[data-testid="navbar-me"]').click();
    cy.get('[data-testid="navbar-me-dropdown-profile"]').click();
    cy.wait(5000);
})

Cypress.Commands.add("goToSettings", () => {
    cy.get('[data-testid="navbar-me"]').click();
    cy.get('[data-testid="navbar-me-dropdown-settings"]').click();
    cy.wait(5000);
});

Cypress.Commands.add("getBlockedList", () => {
    return cy.get(':nth-child(4) > .bg-cardBackground > :nth-child(3)');
});

Cypress.Commands.add("getUnblockButton", () => {
    return cy.contains("Unblock");
});

Cypress.Commands.add("getReportForSomethingElseButton", () => {
    return cy.get('.space-y-2 > .text-blue-600');
});

Cypress.Commands.add("getReportReasonTextArea", () => {
    return cy.get('.rounded-xl > .w-full');
});

Cypress.Commands.add("getReportConfirmationButton", () => {
    return cy.get('.rounded-xl > .flex > .text-white');
});

Cypress.Commands.add("getPostMoreButton", () => {
    return cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .absolute > .flex > .relative > .h-full > [data-testid="postEllipsis"]');
});

Cypress.Commands.add("getReportPostButton", () => {
    return cy.get('[data-testid="postEllipsis-report-post"]');
});

Cypress.Commands.add("getReportForGraphicContentButton", () => {
    return cy.get('.flex-wrap > :nth-child(8)');
});

Cypress.Commands.add("getReportPostConfirmationButton", () => {
    return cy.get('.text-white');
});

