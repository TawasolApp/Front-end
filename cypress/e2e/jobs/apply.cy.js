describe("applies for jobs", () => {
    let user;
  
    beforeEach(() => {
      cy.visit("http://localhost:5173");
      cy.getUpperRegistrationButton().click();
      user = {
        email: "",
        password: "07032004",
      };
      const randomString = Math.random().toString(36).substring(2, 10);
      user.email = `${randomString}@mailinator.com`;
      const inboxName = randomString;
  
      cy.register(user, inboxName);
    });
  
    it("Applies for jobs", () => {
      cy.getSearchBar().type("Senior Applications Orchestrator");
      cy.getSearchBar().type("{enter}");
  
      cy.wait(5000);
  
      cy.getSearchDropDownMenu().click();
      cy.getSearchDropDownJobs().click();
  
      cy.wait(5000);
  
      cy.getJobsFirstSearchResult().click();

      cy.wait(5000);

      cy.getJobApplyButton().click();

      cy.getPhoneNumberInput().type("1234567890");

      cy.getSubmitApplicationButton().click();

    });
  });
  