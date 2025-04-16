describe("adds, updates, deletes skills", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();
  });

  it("interacts with skills", () => {
    let user1 = {
      email: "",
      password: "07032004",
    };
    const randomString = Math.random().toString(36).substring(2, 10);
    user1.email = `${randomString}@mailinator.com`;
    const inboxName = randomString;

    const firstName1 = Math.random().toString(36).substring(2, 10);
    const lastName1 = Math.random().toString(36).substring(2, 10);
    cy.register(user1, inboxName, firstName1, lastName1);

    // go to profile
    cy.get("div.relative > .flex-col > .flex > span").click();
    cy.get(".border-b > .p-4").click();
    cy.get("div.relative > .flex-col > .flex > span").click();

    cy.wait(5000);

    // assert no skills added
    cy.get(":nth-child(5) > .text-normaltext").should(
      "include.text",
      "No skills added yet.",
    );

    // add skill
    cy.get(":nth-child(5) > .justify-between > .gap-0 > .w-8").click();
    cy.get("#skillName").type("Cooking");
    cy.get('[data-testid="save-button"]').click();

    cy.wait(5000);

    // assert existence
    cy.get(".pr-8 > .break-all > .text-lg").should("include.text", "Cooking");

    // edit skill
    cy.get(":nth-child(5) > .justify-between > .gap-0 > :nth-child(2)").click();
    cy.get(".group > .absolute").click();
    cy.get("#position").type("Chef");
    cy.get('[data-testid="save-button"]').click();
    cy.get(".gap-2 > .w-10").click();

    cy.wait(5000);

    // assert existence of updates
    cy.get(".pr-8 > .break-all > .text-lg").should("include.text", "Cooking");
    cy.get(".pr-8 > .break-all > .text-companyheader").should(
      "include.text",
      "Chef",
    );

    // delete skill
    cy.get(":nth-child(5) > .justify-between > .gap-0 > :nth-child(2)").click();
    cy.get(".group > .absolute").click();
    cy.get('[data-testid="delete-button"]').click();
    cy.get('[data-testid="confirm-modal"]').click();
    cy.get(".gap-2 > .w-10").click();

    cy.wait(5000);

    // assert non-existence of updates
    cy.contains("Cooking").should("not.exist");
    cy.contains("Chef").should("not.exist");
  });
});
