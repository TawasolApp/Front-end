describe("saves jobs", () => {
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
  
    it("Saves job for later", () => {
      cy.getSearchBar().type("Senior Applications Orchestrator");
      cy.getSearchBar().type("{enter}");
  
      cy.wait(5000);
  
      cy.getSearchDropDownMenu().click();
      cy.getSearchDropDownJobs().click();
  
      cy.wait(5000);
  
      cy.getJobsFirstSearchResult().click();

      cy.wait(5000);

      cy.getJobSaveButton().click();

      cy.getHome().click();

      cy.wait(5000);

      cy.getSavedItems().click();

      cy.wait(5000);

      cy.getSavedJobs().click();

      cy.wait(5000);

      cy.getFirstSavedJob().should(
        "contain",
        "Senior Applications Orchestrator"
      );
    });
  });
  