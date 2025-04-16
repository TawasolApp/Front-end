describe("endorsements, visibility, and viewing other profiles", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();
  });

  it("interacts with endorsements and tests visibility", () => {
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

    // make it visible to connections only
    cy.get(".z-10 > .w-8").click();
    cy.get(".text-w-full").click();
    cy.get(":nth-child(2) > .flex > .accent-blue-600").check();
    cy.get(".bg-black\\/40 > .rounded-lg > .justify-end > .text-white").click();

    // add skill
    cy.get(":nth-child(5) > .justify-between > .gap-0 > .w-8").click();
    cy.get("#skillName").type("Coding");
    cy.get('[data-testid="save-button"]').click();

    cy.wait(5000);

    // send connection request to userNatalia
    cy.fixture("users.json").then((users) => {
      let user2 = users.userNatalia;
      let user3 = users.userDestiny;

      // go to Natalia's profile
      cy.get(".pl-10").clear();
      cy.get(".pl-10").type("Natalia{enter}");
      cy.wait(5000);
      cy.get(".mr-4 > .flex").click();
      cy.get(".absolute > .py-1 > :nth-child(2)").click();
      cy.wait(5000);
      cy.get(".text-authorName").click();
      cy.wait(5000);

      // assert profile is correct and private

      cy.get(".pt-4 > .text-xl").should("include.text", "Natalia Rosenbaum");
      cy.contains("Only the profile owner can view this profile").should(
        "be.visible",
      );

      // send connection request
      cy.get(".capitalize").click();

      // log in as Natalia
      cy.login(user2);

      // go to my network
      cy.get(":nth-child(2) > :nth-child(2) > .text-xs").click();

      // accept most recent connection request
      cy.get(
        ":nth-child(1) > .justify-between > .space-x-3 > .text-buttonSubmitEnable",
      ).click();

      // search for user1
      cy.get(".pl-10").clear();
      cy.get(".pl-10").type(`${firstName1}{enter}`);
      cy.wait(5000);
      cy.get(".mr-4 > .flex").click();
      cy.get(".absolute > .py-1 > :nth-child(2)").click();
      cy.wait(5000);
      cy.get(".text-authorName").click();
      cy.wait(5000);

      // assert profile is visible
      cy.get(".pt-4 > .text-xl").should(
        "include.text",
        `${firstName1} ${lastName1}`,
      );
      cy.get(":nth-child(3) > .p-6 > .justify-between > .text-2xl").should(
        "include.text",
        "Experience",
      );
      cy.get(":nth-child(4) > .justify-between > .text-2xl").should(
        "include.text",
        "Skills",
      );

      // endorse skill
      cy.get(".mt-2").click();

      // assert endorsement
      cy.get(".break-all > div > .text-companyheader").should(
        "include.text",
        "1 endorsement",
      );
      cy.get(".mt-2").should("include.text", "Endorsed");

      // log in again with user1 and assert that user2 profile is still not visible and then log in again with user2 and that endorsement exists
      cy.login(user1);
      // go to Natalia's profile
      cy.get(".pl-10").clear();
      cy.get(".pl-10").type("Natalia{enter}");
      cy.wait(5000);
      cy.get(".mr-4 > .flex").click();
      cy.get(".absolute > .py-1 > :nth-child(2)").click();
      cy.wait(5000);
      cy.get(".text-authorName").click();
      cy.wait(5000);
      // assert profile is correct and private
      cy.get(".pt-4 > .text-xl").should("include.text", "Natalia Rosenbaum");
      cy.contains("Only the profile owner can view this profile").should(
        "be.visible",
      );
      // go to profile
      cy.get("div.relative > .flex-col > .flex > span").click();
      cy.get(".border-b > .p-4").click();
      cy.get("div.relative > .flex-col > .flex > span").click();
      //assert existence of enorsement
      // cy.get(".break-all > div > .text-companyheader").should(
      //   "include.text",
      //   "1 endorsement"
      // );
      // cy.get(".mt-2").should("include.text", "Endorsed");

      // go to Destiny's profile
      cy.get(".pl-10").clear();
      cy.get(".pl-10").type("Destiny{enter}");
      cy.wait(5000);
      cy.get(".mr-4 > .flex").click();
      cy.get(".absolute > .py-1 > :nth-child(2)").click();
      cy.wait(5000);
      cy.get(".text-authorName").click();
      cy.wait(5000);
      // assert profile is correct and public
      cy.contains("This Profile is Private").should("not.exist");

      // send connection request
      cy.get(".capitalize").click();

      // log in as Destiny
      cy.login(user3);

      // go to my network
      cy.get(":nth-child(2) > :nth-child(2) > .text-xs").click();

      // accept most recent connection request
      cy.get(
        ":nth-child(1) > .justify-between > .space-x-3 > .text-buttonSubmitEnable",
      ).click();

      // search for user1
      cy.get(".pl-10").clear();
      cy.get(".pl-10").type(`${firstName1}{enter}`);
      cy.wait(5000);
      cy.get(".mr-4 > .flex").click();
      cy.get(".absolute > .py-1 > :nth-child(2)").click();
      cy.wait(5000);
      cy.get(".text-authorName").click();
      cy.wait(5000);

      // assert profile is visible
      cy.get(".pt-4 > .text-xl").should(
        "include.text",
        `${firstName1} ${lastName1}`,
      );
      cy.get(":nth-child(3) > .p-6 > .justify-between > .text-2xl").should(
        "include.text",
        "Experience",
      );
      cy.get(":nth-child(4) > .justify-between > .text-2xl").should(
        "include.text",
        "Skills",
      );

      // assert endorsement
      cy.get(".break-all > div > .text-companyheader").should(
        "include.text",
        "1 endorsement",
      );
      cy.get(".mt-2").should("include.text", "Endorse");

      // log back in with user2
      cy.login(user2);

      // search for user1
      cy.get(".pl-10").clear();
      cy.get(".pl-10").type(`${firstName1}{enter}`);
      cy.wait(5000);
      cy.get(".mr-4 > .flex").click();
      cy.get(".absolute > .py-1 > :nth-child(2)").click();
      cy.wait(5000);
      cy.get(".text-authorName").click();
      cy.wait(5000);

      // remove endorsement
      cy.get(".mt-2").click();

      // assert no endorsement
      cy.contains("1 endorsement").should("not.exist");
      cy.get(".mt-2").should("include.text", "Endorse");

      // remove connection
      cy.get(".capitalize").click();
      cy.wait(5000);

      cy.reload();

      // profile should not be visible
      cy.contains("Experience").should("not.exist");
      cy.contains("Skills").should("not.exist");
      cy.contains("Connect with this member to view their full profile").should(
        "be.visible",
      );
    });
  });
});
