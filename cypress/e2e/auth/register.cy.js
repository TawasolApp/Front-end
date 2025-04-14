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

  //   it("Registers successfully", () => {
  //     // Generate random Mailinator email
  //     const randomString = Math.random().toString(36).substring(2, 10);
  //     user.email = `${randomString}@mailinator.com`;
  //     const inboxName = randomString;

  //     // Complete registration form
  //     cy.getRegistrationFormEmailTextbox().type(user.email);
  //     cy.getRegistrationFormPasswordTextbox().type(user.password);
  //     cy.getRegistrationFormButton().click();

  //     // Complete profile info
  //     cy.get("#firstName").type("Marwan");
  //     cy.get("#lastName").type("Ahmed");
  //     cy.get(".py-3").click();

  //     cy.wait(10000);

  //     // Verify email was sent
  //     cy.contains("Email Verification Pending").should("be.visible");

  //     // First origin: Mailinator email retrieval
  //     cy.origin(
  //       "https://www.mailinator.com",
  //       { args: { inboxName } },
  //       ({ inboxName }) => {
  //         // Visit the Mailinator inbox directly
  //         cy.visit(
  //           `https://www.mailinator.com/v4/public/inboxes.jsp?to=${inboxName}`
  //         );

  //         // Wait for emails to load
  //         cy.wait(10000);

  //         // Find the verification email
  //         cy.get(
  //           '[style="width:300px;max-width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 22px;"]'
  //         ).click();

  //         // Get the verification URL from the email
  //         cy.get("#html_msg_body", { timeout: 10000 }).should("exist");
  //         cy.get("#html_msg_body").then(($iframe) => {
  //           const iframe = $iframe.contents();
  //           cy.wrap(iframe)
  //             .find("a")
  //             .contains("here")
  //             .invoke("attr", "href")
  //             .then((verificationUrl) => {
  //               // Store the URL in the parent test context
  //               Cypress.env("verificationUrl", verificationUrl);
  //             });
  //         });
  //       }
  //     );

  //     // Back in main origin, get the stored URL and verify
  //     cy.then(() => {
  //       const verificationUrl = Cypress.env("verificationUrl");
  //       cy.log(`Verification URL: ${verificationUrl}`);

  //       // Visit the verification URL directly
  //       cy.visit(verificationUrl);

  //       cy.origin("https://tawasolapp.me", { args: { user } }, ({ user }) => {
  //         // Verify successful verification
  //         cy.contains("Welcome!").should("be.visible");

  //         // Enter location
  //         cy.get("#location").type("Wakanda");
  //         cy.contains("button", "Next").click();

  //         // Enter job information
  //         cy.get("input#jobTitle").type("Software Developer");
  //         cy.get("select#employmentType").select("Internship");
  //         cy.get("input#company").type("Tawasol");
  //         cy.get('select[name="month"]').select("July");
  //         cy.get('select[name="day"]').select("10");
  //         cy.get('select[name="year"]').select("2024");
  //         cy.contains("button", "Continue").click();

  //         // Assert redirection to login page
  //         cy.wait(10000);
  //         cy.url().should("include", "/auth/signin");

  //         // Log in
  //         cy.get('#email').type(user.email);
  //         cy.get('#password').type(user.password);
  //         cy.get('.focus\\:ring-2').click();
  //         cy.url().should("include", "/feed");
  //       });
  //     });
  //   });

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

  it("Resends confirmation email", () => {
    // Generate random Mailinator email
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;

    // Complete registration form
    cy.getRegistrationFormEmailTextbox().type(user.email);
    cy.getRegistrationFormPasswordTextbox().type(user.password);
    cy.getRegistrationFormButton().click();

    // Complete profile info
    cy.get("#firstName").type("Marwan");
    cy.get("#lastName").type("Ahmed");
    cy.get(".py-3").click();

    cy.wait(10000);

    // Verify email was sent
    cy.contains("Email Verification Pending").should("be.visible");

    // Resend email
    cy.wait(5000);
    cy.get(
      ".max-w-lg > :nth-child(1) > div > .text-buttonSubmitEnable"
    ).click();

    // First origin: Mailinator email retrieval
    cy.origin(
      "https://www.mailinator.com",
      { args: { inboxName } },
      ({ inboxName }) => {
        // Visit the Mailinator inbox directly
        cy.visit(
          `https://www.mailinator.com/v4/public/inboxes.jsp?to=${inboxName}`
        );

        // Wait for emails to load
        cy.wait(10000);

        // Assert the existence of 2 emails
        cy.get(
          '[style="width:300px;max-width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 22px;"]'
        ).should("have.length", 2);

        // Click on the most recent verification email
        cy.get(
          '[style="width:300px;max-width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 22px;"]'
        )
          .first()
          .click();

        // Assert that the verification URL exists in the most recent email
        cy.get("#html_msg_body", { timeout: 10000 }).should("exist");
        cy.get("#html_msg_body").then(($iframe) => {
          const iframe = $iframe.contents();
          cy.wrap(iframe)
            .find("a")
            .contains("here")
            .invoke("attr", "href")
            .then((verificationUrl) => {
              // Store the URL in the parent test context
              Cypress.env("verificationUrl", verificationUrl);
            });
        });
      }
    );
  });
});
