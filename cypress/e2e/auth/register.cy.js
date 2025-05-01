describe("register", () => {
  let user = {
    email: "",
    password: "07032004",
    verificationUrl: "",
  };

  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();

    // Validate registration form
    cy.getRegistrationFormEmailLabel().should("have.text", "Email");
    cy.getRegistrationFormEmailTextbox().should("exist");
    cy.getRegistrationFormPasswordLabel().should(
      "have.text",
      "Password (6+ characters)"
    );
    cy.getRegistrationFormPasswordTextbox().should("exist");
    cy.getRegistrationFormButton().should("exist");
  });

  it("Registers successfully", () => {
    // Generate random Mailinator email
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;

    cy.register(user, inboxName);
  });

  it("Does not register due to invalid email", () => {
    // Generate random Mailinator email
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator`;

    // Complete registration form
    cy.getRegistrationFormEmailTextbox().type(user.email);
    cy.getRegistrationFormPasswordTextbox().type(user.password);
    cy.getRegistrationFormButton().click();

    cy.get(".text-red-500").should(
      "have.text",
      "Please enter a valid email address."
    );
    cy.url().should("not.include", "auth/signup/name");
  });

  it("Does not register due to invalid password", () => {
    // Generate random Mailinator email
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    user.password = "07032";

    // Complete registration form
    cy.getRegistrationFormEmailTextbox().type(user.email);
    cy.getRegistrationFormPasswordTextbox().type(user.password);
    cy.getRegistrationFormButton().click();

    cy.get(".text-red-500").should(
      "have.text",
      "Password must be at least 6 characters long"
    );
    cy.url().should("not.include", "auth/signup/name");
  });

  it("Does not register due to invalid name", () => {
    // Generate random Mailinator email
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    user.password = "07032004";

    // Complete registration form
    cy.getRegistrationFormEmailTextbox().type(user.email);
    cy.getRegistrationFormPasswordTextbox().type(user.password);
    cy.getRegistrationFormButton().click();

    // Don't provide name
    cy.contains("button", "Continue").click();

    // Assert failure to proceed
    cy.get(".text-red-500").should(
      "have.text",
      "Please enter your first name."
    );
    cy.url().should("include", "auth/signup/name");

    // Enter first name
    cy.get("#firstName").type("Marwan");
    cy.contains("button", "Continue").click();

    // Assert failure to proceed
    cy.get(".text-red-500").should("have.text", "Please enter your last name.");
    cy.url().should("include", "auth/signup/name");
  });
});
