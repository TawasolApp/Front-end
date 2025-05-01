// *********************************************** LOGIN & REGISTRATION PAGE ***********************************************

Cypress.Commands.add("getUpperRegistrationButton", () => {
  return cy.get(".space-x-2 > .text-textContent");
});

Cypress.Commands.add("getUpperLoginButton", () => {
  return cy.get(".space-x-2 > .text-buttonSubmitEnable");
});

Cypress.Commands.add("getMainRegistrationButton", () => {
  return cy.get("div.w-full > .space-y-4 > .mt-4 > .text-buttonSubmitEnable");
});

Cypress.Commands.add("getMainLoginButton", () => {
  return cy.get("div.w-full > .space-y-4 > .transition");
});

Cypress.Commands.add("getGoogleLoginButton", () => {
  return cy.get("div.w-full > .space-y-4 > .gap-3");
});

Cypress.Commands.add("getLoginPageHeader", () => {
  return cy.get(".mx-auto > .items-center");
});

Cypress.Commands.add("getLoginPageGreeting", () => {
  return cy.get(".text-3xl");
});

Cypress.Commands.add("getLoginPagePicture", () => {
  return cy.get(".p-6 > .darken");
});

// *********************************************** LOGIN FORM ***********************************************

Cypress.Commands.add("getLoginFormEmailLabel", () => {
  cy.get(":nth-child(4) > .block");
});

Cypress.Commands.add("getLoginFormEmailTextbox", () => {
  cy.get("#email");
});

Cypress.Commands.add("getLoginFormPasswordLabel", () => {
  cy.get(":nth-child(5) > .block");
});

Cypress.Commands.add("getLoginFormPasswordTextbox", () => {
  cy.get("#password");
});

Cypress.Commands.add("getLoginFormForgotPasswordLink", () => {
  cy.get(".sm\\:mb-6 > .font-medium");
});

Cypress.Commands.add("getLoginFormButton", () => {
  cy.get(".focus\\:ring-2");
});

// *********************************************** REGISTRATION FORM ***********************************************

Cypress.Commands.add("getRegistrationFormEmailLabel", () => {
  cy.get(":nth-child(1) > .block");
});

Cypress.Commands.add("getRegistrationFormEmailTextbox", () => {
  cy.get("#email");
});

Cypress.Commands.add("getRegistrationFormPasswordLabel", () => {
  cy.get(":nth-child(2) > .block");
});

Cypress.Commands.add("getRegistrationFormPasswordTextbox", () => {
  cy.get("#password");
});

Cypress.Commands.add("getRegistrationFormButton", () => {
  cy.get(".focus\\:ring-2");
});

Cypress.Commands.add(
  "register",
  (user, inboxName, firstName = "Marwan", lastName = "Ahmed") => {
    // Complete registration form
    cy.getRegistrationFormEmailTextbox().type(user.email);
    cy.getRegistrationFormPasswordTextbox().type(user.password);
    cy.getRegistrationFormButton().click();

    // Complete profile info
    cy.get("#firstName").type(firstName);
    cy.get("#lastName").type(lastName);
    cy.get(".py-2\\.5").click();

    cy.wait(10000);

    cy.url().should("include", "/auth/signin");

    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('button[type="submit"]').click();

    // Verify successful verification
    cy.contains("Welcome").should("be.visible");

    // Enter location
    cy.get("#location").type("Wakanda");
    cy.contains("button", "Next").click();

    // Enter job information
    cy.get("input#jobTitle").type("Software Developer");
    cy.get("select#employmentType").select("Internship");
    cy.get("input#company").type("Tawasol");
    cy.get('select[name="month"]').select("July");
    cy.get('select[name="day"]').select("10");
    cy.get('select[name="year"]').select("2024");
    cy.contains("button", "Continue").click();

    // Assert redirection to feed
    cy.wait(10000);
    cy.url().should("include", "/feed");
    // });
  }
);
