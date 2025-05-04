describe("privacy & security test", () => {
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
  
    it("tests blocking", () => {
      cy.getSearchBar().type(user1.firstName);
      cy.getSearchBar().type("{enter}");
      cy.wait(5000);
  
      cy.getSearchDropDownMenu().click();
      cy.getSearchDropDownPeople().click();
      cy.wait(5000);
  
      cy.getPeopleFirstSearchResult().click();
      cy.wait(5000);

      cy.getProfileMoreButton().click();
      cy.getBlockOrReportButton().click();
      cy.getBlockButton().click();
      cy.getBlockConfirmationButton().click();
      cy.wait(5000);

      cy.url().should("include", "/feed");
      cy.getSearchBar().clear();
      cy.getSearchBar().type(user1.firstName);
      cy.getSearchBar().type("{enter}");
      cy.wait(5000);
  
      cy.getSearchDropDownMenu().click();
      cy.getSearchDropDownPeople().click();
      cy.wait(5000);

      cy.contains("No results found").should("be.visible");

      cy.goToSettings();
      cy.getBlockedList().click();
      cy.wait(5000);

      cy.contains("currently blocking 1 person").should("be.visible");
      cy.contains(user1.firstName).should("be.visible");
      cy.getUnblockButton().click();
      cy.getBlockConfirmationButton().click();
      cy.wait(5000);

      cy.contains("currently not blocking anyone").should("be.visible");

      cy.getSearchBar().clear();
      cy.getSearchBar().type(user1.firstName);
      cy.getSearchBar().type("{enter}");
      cy.wait(5000);
  
      cy.getSearchDropDownMenu().click();
      cy.getSearchDropDownPeople().click();
      cy.wait(5000);

      cy.contains(user1.firstName).should("be.visible");
  
    });

    it("tests reporting a user", () => {
      cy.getSearchBar().type(user1.firstName);
      cy.getSearchBar().type("{enter}");
      cy.wait(5000);
  
      cy.getSearchDropDownMenu().click();
      cy.getSearchDropDownPeople().click();
      cy.wait(5000);
  
      cy.getPeopleFirstSearchResult().click();
      cy.wait(5000);

      cy.getProfileMoreButton().click();
      cy.getBlockOrReportButton().click();
      cy.getReportButton().click();
      cy.getReportForSomethingElseButton().click();
      cy.getReportReasonTextArea().type("This person is malicious.");
      cy.getReportConfirmationButton().click();
      cy.contains("Report submitted successfully").should("be.visible");
  
    });

    it("tests reporting a post", () => {
      cy.getSearchBar().type("Calculus");
      cy.getSearchBar().type("{enter}");
      cy.wait(5000);

      
      
      cy.getPostMoreButton().click();
      cy.getReportPostButton().click();
      cy.getReportForGraphicContentButton().click();
      cy.getReportPostConfirmationButton().click();
      cy.contains("Report submitted successfully").should("be.visible");
    });
  });
  