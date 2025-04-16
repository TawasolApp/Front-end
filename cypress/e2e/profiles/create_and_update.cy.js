describe("creates and updates profile", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();
  });

  it("Changes some profile info after registration", () => {
    let user = {
      email: "",
      password: "07032004",
    };
    const randomString = Math.random().toString(36).substring(2, 10);
    user.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;
    cy.register(user, inboxName);

    // go to profile
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-b > .p-4").click();

    // click on edit icon
    cy.get(".justify-start").click();
    cy.get(".right-8").click();

    // updates info
    cy.get("#location").clear();
    cy.get("#location").type("Australia");
    cy.get("#industry").clear();
    cy.get("#industry").type("Software Engineering");
    cy.get(".flex > .px-4").click();

    // assert new info is displayed
    cy.contains("Australia").should("be.visible");
    cy.get("p").contains("Wakanda").should("not.exist");

    // add bio
    cy.get(".justify-between > .w-8").click();
    cy.get(".shadow-md.relative > .fixed > .p-6 > .w-full").type("Hello");
    cy.get(".shadow-md.relative > .fixed > .p-6 > .flex > .px-4").click();

    cy.wait(2000);

    // aseert existence
    cy.get(".text-sm > .whitespace-pre-wrap").should("have.text", "Hello");

    // update bio
    cy.get(".justify-between > .w-8").click();
    cy.get(".shadow-md.relative > .fixed > .p-6 > .w-full").type(", world!");
    cy.get(".shadow-md.relative > .fixed > .p-6 > .flex > .px-4").click();

    // assert update
    cy.get(".text-sm > .whitespace-pre-wrap").should(
      "have.text",
      "Hello, world!",
    );
  });
});
