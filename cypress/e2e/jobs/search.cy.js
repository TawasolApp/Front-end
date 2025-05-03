describe("searches for jobs", () => {
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

  it("Searches for job by keyword", () => {
    cy.getSearchBar().type("Senior Applications Orchestrator");
    cy.getSearchBar().type("{enter}");

    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownJobs().click();

    cy.wait(5000);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Senior Applications Orchestrator"
    );
  });

  it("Searches for job by industry", () => {
    cy.getSearchBar().type("Senior");
    cy.getSearchBar().type("{enter}");

    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownJobs().click();

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 3);

    cy.getIndustryFilter().type("Toys");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 1);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Senior Applications Orchestrator"
    );
  });

  it("Searches for job by location", () => {
    cy.getSearchBar().type("Senior");
    cy.getSearchBar().type("{enter}");

    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownJobs().click();

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 3);

    cy.getLocationFilter().type("Johnston Inlet");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 1);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Senior Applications Orchestrator"
    );
  });

  it("Searches for job by experience level", () => {
    cy.getJobsPage().click();

    cy.wait(5000);

    cy.getExperienceLevelFilter().select("Internship");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 3);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Senior Applications Orchestrator"
    );
  });

  it("Searches for job by company", () => {
    cy.getJobsPage().click();

    cy.wait(5000);

    cy.getCompanyFilter().type("Toy - Fritsch");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 4);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Senior Applications Orchestrator"
    );
  });

  it("Searches for job by salary", () => {
    cy.getJobsPage().click();

    cy.wait(5000);

    cy.getMinSalaryFilter().type("4109274686190554");
    cy.getMaxSalaryFilter().type("4109274686190556");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 1);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Senior Applications Orchestrator"
    );
  });
});
