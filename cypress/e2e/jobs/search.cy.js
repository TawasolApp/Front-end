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
    cy.getSearchBar().type("Customer Optimization Planner");
    cy.getSearchBar().type("{enter}");

    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownJobs().click();

    cy.wait(5000);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Customer Optimization Planner"
    );
  });

  it("Searches for job by industry", () => {
    cy.getSearchBar().type("Customer");
    cy.getSearchBar().type("{enter}");

    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownJobs().click();

    cy.wait(5000);

    cy.getIndustryFilter().type("Home");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 3);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Customer Optimization Planner"
    );
  });

  it("Searches for job by location", () => {
    cy.getSearchBar().type("Customer");
    cy.getSearchBar().type("{enter}");

    cy.wait(5000);

    cy.getSearchDropDownMenu().click();
    cy.getSearchDropDownJobs().click();

    cy.wait(5000);

    cy.getLocationFilter().type("Castle Lane");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 1);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Customer Optimization Planner"
    );
  });

  it("Searches for job by experience level", () => {
    cy.getJobsPage().click();

    cy.wait(5000);

    cy.getExperienceLevelFilter().select("Director");

    cy.wait(5000);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Customer Optimization Planner"
    );
  });

  it("Searches for job by company", () => {
    cy.getJobsPage().click();

    cy.wait(5000);

    cy.getCompanyFilter().type("Carroll - Denesik");

    cy.wait(5000);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Customer Optimization Planner"
    );
  });

  it("Searches for job by salary", () => {
    cy.getJobsPage().click();

    cy.wait(5000);

    cy.getMinSalaryFilter().type("8809372402024850");
    cy.getMaxSalaryFilter().type("8809372402024852");

    cy.wait(5000);

    cy.getJobsSearchResults().should("have.length", 1);

    cy.getJobsFirstSearchResult().should(
      "contain",
      "Customer Optimization Planner"
    );
  });
});
