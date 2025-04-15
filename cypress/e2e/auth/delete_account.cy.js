describe("delete account", () => {
    let user = {
      email: "",
      password: "07032004",
      verificationUrl: "",
    };
  
    beforeEach(() => {
      cy.visit("http://localhost:5173");
    });
  
      it("Deletes account", () => {
        // register new user
        cy.visit("http://localhost:5173");
        cy.getUpperRegistrationButton().click();
        const randomString = Math.random().toString(36).substring(2, 10);
        user.email = `${randomString}@mailinator.com`;
        const inboxName = randomString;
        cy.register(user, inboxName);

        // delete account
        cy.get("div.relative > .flex-col > .flex > span").click();
        cy.get(".border-t > :nth-child(1)").click();
        cy.get(':nth-child(5) > .flex').click();
        cy.get('.py-3').click();

        cy.wait(5000);

        // try to log in
        cy.getLoginFormEmailTextbox().type(user.email);
        cy.getLoginFormPasswordTextbox().type(user.password);
        cy.getLoginFormButton().click();
        
        // Assert login failure
        cy.url().should("include", "/auth/signin");
        cy.get(".text-red-500").should("have.text", "Invalid email or password.");
      });
  });
  