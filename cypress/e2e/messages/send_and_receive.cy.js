describe("sends and receives messages", () => {
  let user1;
  let user2;

  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();
    user1 = {
      email: "",
      password: "07032004",
      firstName: "",
      lastName: "",
    };
    const randomString1 = Math.random().toString(36).substring(2, 10);
    user1.email = `${randomString1}@mailinator.com`;
    const inboxName1 = randomString1;
    user1.firstName = randomString1;
    user1.lastName = randomString1;
    cy.register(user1, inboxName1, user1.firstName, user1.lastName);

    cy.visit("http://localhost:5173");
    cy.getUpperRegistrationButton().click();
    user2 = {
      email: "",
      password: "07032004",
      firstName: "",
      lastName: "",
    };
    const randomString2 = Math.random().toString(36).substring(2, 10);
    user2.email = `${randomString2}@mailinator.com`;
    const inboxName2 = randomString2;
    user2.firstName = randomString2;
    user2.lastName = randomString2;
    cy.register(user2, inboxName2, user2.firstName, user2.lastName);
  });

  it("Sends a message, checks unseen count and ensures its receipt on the other side", () => {
    cy.getSearchBar().type(user1.firstName);
    cy.getSearchBar().type("{enter}");
    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownPeople().click();
    cy.wait(5000);

    cy.getPeopleFirstSearchResult().click();
    cy.wait(5000);

    cy.getMessageUserButton().click();
    cy.wait(5000);

    cy.getMessageAreaInput().type("Hello, this is a test message!");
    cy.getMessageSendButton().click();
    cy.wait(5000);

    cy.getMessagesPage().click();
    cy.wait(5000);

    cy.getFirstChat().should("contain", user1.firstName);
    cy.getFirstChat().click();
    cy.wait(5000);

    cy.getMessageContent().should("contain", "Hello, this is a test message!");
    cy.getSentIcon().should("exist");
    cy.wait(5000);

    cy.login(user1);
    cy.wait(5000);

    cy.getMessagesPage().click();
    cy.wait(5000);

    cy.login(user2);
    cy.wait(5000);

    cy.getMessagesPage().click();
    cy.wait(5000);

    cy.getFirstChat().click();
    cy.wait(5000);

    cy.getDeliveredIcon().should("exist");

    cy.login(user1);
    cy.wait(5000);

    cy.getMessagesPage().click();
    cy.wait(5000);

    cy.getFirstChat().should("contain", user2.firstName);
    cy.getUnseenMessagesCount().should("contain", "1");
    cy.getFirstChat().click();
    cy.wait(5000);

    cy.getMessageContent().should("contain", "Hello, this is a test message!");

    cy.getSenderAvatar().trigger('mouseover');
    cy.wait(3000);
    cy.getHoveredSenderAvatar().click();
    cy.wait(5000);

    cy.getMarkAsReadButton().click();
    cy.wait(5000);

    cy.getUnseenMessagesCount().should("not.exist");

    cy.getSenderAvatar().trigger('mouseover');
    cy.wait(3000);
    cy.getHoveredSenderAvatar().click();
    cy.wait(5000);

    cy.getMarkAsUnreadButton().click();
    cy.wait(5000);

    cy.getUnseenMessagesCount().should("exist");

    cy.login(user2);
    cy.wait(5000);

    cy.getMessagesPage().click();
    cy.wait(5000);

    cy.getFirstChat().click();
    cy.wait(5000);

    cy.getReadIcon().should("exist");

  });

  it.skip("Sends media and ensures its receipt on the other side", () => {
    cy.getSearchBar().type(user1.firstName);
    cy.getSearchBar().type("{enter}");
    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownPeople().click();
    cy.wait(5000);

    cy.getPeopleFirstSearchResult().click();
    cy.wait(5000);

    cy.getMessageUserButton().click();
    cy.wait(5000);

    cy.getSendImageButton().selectFile("cypress/fixtures/imgs/polar_bear.png", { force: true });
    cy.wait(10000);
    cy.getMessageSendButton().click();
    cy.wait(5000);

    cy.getMessagesPage().click();
    cy.wait(5000);

    cy.getFirstChat().should("contain", user1.firstName);
    cy.getFirstChat().click();
    cy.wait(5000);

    cy.getSentImageSrc().should("include", "polar_bear.png");
    cy.wait(5000);

    cy.login(user1);
    cy.wait(5000);
    cy.getMessagesPage().click();
    cy.wait(5000);
    cy.getFirstChat().should("contain", user2.firstName);
    cy.getFirstChat().click();
    cy.wait(5000);
    cy.getSentImageSrc().should("include", "polar_bear.png");
  });
});
