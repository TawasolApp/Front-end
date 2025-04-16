describe("Company Creation", () => {
  let user;
  let user2;
  let company;
  let company_updated;
  beforeEach(() => {
    cy.fixture("users.json").then((users) => {
      user = users.userDallas;
      user2 = users.userTrevor;
      cy.login(user);
    });
    cy.fixture("company.json").then((companies) => {
      company = companies.testCompany;
    });
    cy.fixture("company.json").then((companies) => {
      company_updated = companies.testCompany2;
    });
    cy.visit("http://localhost:5173/feed");
  });

  //SEED TO PASS
  it("Creates a company", () => {
    cy.visit("http://localhost:5173/company/setup/new");

    cy.intercept("POST", "**/companies").as("createCompany");
    cy.intercept("POST", "**/api/media").as("uploadMedia");

    cy.getCreateCompanyName().click().type(company.name);
    cy.getCreateCompanyTagline().type(company.tagline);
    cy.getCreateCompanyOrganizationType().select(company.organizationType);
    cy.getCreateCompanyOrganizationSize().select(company.organizationSize);
    cy.getCreateCompanyIndustry().type(company.industry);
    cy.getCreateCompanyOverview().type(company.overview);
    cy.getCreateCompanyFoundedYear().type(company.foundedYear);
    cy.getCreateCompanyWebsite().type(company.website);
    cy.getCreateCompanyAddress().type(company.address);
    cy.getCreateCompanyLocation().type(company.location);
    cy.getCreateCompanyEmail().type(company.email);
    cy.getCreateCompanyPhone().type(company.phone);

    cy.getCreateCompanyLogo().selectFile(company.logo, { force: true });
    cy.wait("@uploadMedia").its("response.statusCode").should("eq", 201);

    cy.getCompanyAgreeement().check();
    cy.getCompanyPageSave().click();
    cy.wait("@createCompany").its("response.statusCode").should("eq", 201);

    cy.getCompanySubHeader()
      .and("contain", company.address)
      .and("contain", company.organizationSize);
  });

  it("Verifies company creation", () => {
    cy.navigateToCompanyPage();
    cy.getShowCompanyDetails().click();
    cy.verifyCompanyDetails(company);
  });

  //SEED TO PASS
  it("Edits a company", () => {
    cy.navigateToCompanyPage();
    cy.getCompanyPageEdit().click();

    cy.getEditCompanyOverview().clear().type(company_updated.overview);
    cy.getEditCompanyDescription().clear().type(company_updated.overview);
    cy.getEditCompanyIndustry().clear().type(company_updated.industry);
    cy.getEditCompanyAddress().clear().type(company_updated.address);
    cy.getEditCompanyWebsite().clear().type(company_updated.website);
    cy.getEditCompanyPhone().clear().type(company_updated.phone);
    cy.getEditCompanyEmail().clear().type(company_updated.email);
    cy.getEditCompanyFoundedYear().clear().type(company_updated.foundedYear);
    cy.getEditCompanySize().select(company_updated.organizationSize);
    cy.getEditSaveButton().click();

    cy.getCompanySubHeader()
      .and("contain", company_updated.address)
      .and("contain", company_updated.organizationSize);
  });

  it("Verifies company edit", () => {
    cy.navigateToCompanyPage();
    cy.getShowCompanyDetails().click();
    cy.verifyCompanyDetails(company_updated);
  });

  it("Creates a Job", () => {
    cy.navigateToCompanyPage();
    cy.getCompanyJobs().click();

    cy.getPostJobButton().click();

    cy.getJobPosition().type("Senior Software Engineer");
    cy.getJobIndustry().type("Software Development");
    cy.getJobLocation().type("New York, NY");
    cy.getJobSalary().type("120000");
    cy.getJobEmploymentType().select("Full-time");
    cy.getJobLocationType().select("Remote");
    cy.getJobExperienceLevel().select("Senior", { force: true });
    cy.getJobDescription().type(
      "We are looking for an experienced software engineer to join our team. The ideal candidate will have strong expertise in React, Node.js, and cloud technologies.",
    );

    cy.getJobSubmitButton().click();
    cy.login(user2);
    cy.navigateToCompanyPage();
  });

  it("Applies to a Job", () => {
    cy.login(user2);
    cy.navigateToCompanyPage();
    cy.getCompanyJobs().click();
    cy.getJobApplyButton().click();

    cy.getJobApplicationEmail().type("applicant@example.com");
    cy.getJobApplicationMobile().type("1234567890");
    cy.getJobApplicationExperience().type("5 years of full-stack development");
    cy.getJobApplicationSalary().type("120000");
    cy.getJobApplicationAgree().select("Yes");

    // Submit application and verify
    cy.getJobApplicationSubmit().click();
  });

  it("Views Job Applications", () => {
    cy.navigateToCompanyPage();
    cy.getCompanyJobs().click();
  });
});
