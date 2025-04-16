describe("change user info", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();
  });

  it("Resets password", () => {
    let user = {
      email: "",
      password: "07032004",
      newPassword: "05032004",
    };

    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;

    cy.register(user, inboxName);

    // sign out
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-t > :nth-child(2)").click();

    // click on forgot password
    cy.url().should("include", "/auth/signin");
    cy.getLoginFormForgotPasswordLink().click();

    // enter email
    cy.get("#email").type(user.email);
    cy.get("form > .flex > .w-full").click();

    cy.wait(10000);

    // Verify email was sent
    cy.contains("Email Verification Pending").should("be.visible");

    // First origin: Mailinator email retrieval
    cy.origin(
      "https://www.mailinator.com",
      { args: { inboxName } },
      ({ inboxName }) => {
        // Visit the Mailinator inbox directly
        cy.visit(
          `https://www.mailinator.com/v4/public/inboxes.jsp?to=${inboxName}`,
        );

        // Wait for emails to load
        cy.wait(10000);

        // Find the verification email
        cy.get(
          '[style="width:300px;max-width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 22px;"]',
        )
          .first()
          .click();

        // Get the verification URL from the email
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
      },
    );

    // Back in main origin, get the stored URL and verify
    cy.then(() => {
      const verificationUrl = Cypress.env("verificationUrl");
      cy.log(`Verification URL: ${verificationUrl}`);

      // Visit the verification URL directly
      cy.visit(verificationUrl);

      // Type new password
      cy.get("#newPassword").type(user.newPassword);
      cy.get("#confirmNewPassword").type(user.newPassword);
      cy.get(".py-3").click();

      // Log in with new password
      cy.getLoginFormEmailTextbox().type(user.email);
      cy.getLoginFormPasswordTextbox().type(user.newPassword);
      cy.getLoginFormButton().click();

      // Assert that news feed is shown
      cy.url().should("include", "/feed");
    });
  });

  it("Changes email", () => {
    let user = {
      email: "",
      password: "07032004",
      newPassword: "05032004",
    };
    const randomStringOld = Math.random().toString(36).substring(2, 10);
    user.email = `${randomStringOld}@mailinator.com`;
    const inboxNameOld = randomStringOld;

    cy.register(user, inboxNameOld);

    const randomStringNew = Math.random().toString(36).substring(2, 10);
    user.newEmail = `${randomStringNew}@mailinator.com`;
    const inboxNameNew = randomStringNew;

    // go to settings and privacy
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-t > :nth-child(1)").click();

    // click on change email
    cy.get(".mt-12 > .bg-cardBackground > :nth-child(1) > .flex").click();

    // enter new email
    cy.get("#newEmail").clear();
    cy.get("#newEmail").type(user.newEmail);
    cy.get("#currentPassword").type(user.password);
    cy.get(".py-3").click();

    // Verify email was sent
    cy.contains("Email Verification Pending").should("be.visible");

    // First origin: Mailinator email retrieval
    cy.origin(
      "https://www.mailinator.com",
      { args: { inboxNameNew } },
      ({ inboxNameNew }) => {
        // Visit the Mailinator inbox directly
        cy.visit(
          `https://www.mailinator.com/v4/public/inboxes.jsp?to=${inboxNameNew}`,
        );

        // Wait for emails to load
        cy.wait(10000);

        // Find the verification email
        cy.get(
          '[style="width:300px;max-width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 22px;"]',
        )
          .first()
          .click();

        // Get the verification URL from the email
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
      },
    );

    // Back in main origin, get the stored URL and verify
    cy.then(() => {
      const verificationUrl = Cypress.env("verificationUrl");
      cy.log(`Verification URL: ${verificationUrl}`);

      // Visit the verification URL directly
      cy.visit(verificationUrl);

      // Assert that news feed is shown
      cy.url().should("include", "/feed");
    });
  });

  it("Changes password", () => {
    let user = {
      email: "",
      password: "07032004",
      newPassword: "05032004",
    };
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;

    cy.register(user, inboxName);

    user.newPassword = "05032004";

    // go to settings and privacy
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-t > :nth-child(1)").click();

    // click on change password
    cy.get(":nth-child(3) > .flex").click();

    // enter current and new password
    cy.get("#currentPassword").type(user.password);
    cy.get("#newPassword").type(user.newPassword);
    cy.get("#confirmNewPassword").type(user.newPassword);
    cy.get(".flex-col > .w-full").click();

    // go back
    cy.get(".mb-3").click();

    // sign out
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-t > :nth-child(2)").click();

    // log in with new password
    cy.getLoginFormEmailTextbox().type(user.email);
    cy.getLoginFormPasswordTextbox().type(user.newPassword);
    cy.getLoginFormButton().click();

    cy.url().should("include", "/feed");
  });

  it("Changes name", () => {
    let user = {
      email: "",
      password: "07032004",
      newPassword: "05032004",
    };
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;
    let newFirstName = "Ahmed";
    let newLastName = "Marwan";
    cy.register(user, inboxName);

    // go to profile
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-b > .p-4").click();

    // click on edit icon
    cy.get(".justify-start").click();
    cy.get(".right-8").click();

    // enter current and new password
    cy.get("#firstName").clear();
    cy.get("#firstName").type(newFirstName);
    cy.get("#lastName").clear();
    cy.get("#lastName").type(newLastName);
    cy.get("#industry").type("Software Engineering");
    cy.get(".flex > .px-4").click();

    // assert new name is displayed
    cy.get(".pt-4 > .text-xl").should(
      "have.text",
      `${newFirstName} ${newLastName}`,
    );
  });
});
