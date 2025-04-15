// *********************************************** SEARCH DROPDOWN OPTIONS ***********************************************

Cypress.Commands.add('getSearchDropdown', () => {
    return cy.get('[data-testid="SearchDropdown"]');
});

Cypress.Commands.add('getSearchDropdownPosts', () => {
    return cy.get('[data-testid="SearchDropdownOption-posts"]');
});

Cypress.Commands.add('getSearchDropdownPeople', () => {
    return cy.get('[data-testid="SearchDropdownOption-people"]');
});

Cypress.Commands.add('getSearchDropdownCompanies', () => {
    return cy.get('[data-testid="SearchDropdownOption-companies"]');
});

Cypress.Commands.add('getCompanySearch', () => {
    return cy.get('.text-authorName');
})



// *********************************************** CREATE COMPANY ***********************************************

Cypress.Commands.add('getCreatePage', () => {
    return cy.get('[data-testid="create-page"]');
});

Cypress.Commands.add('getCompanyPageEllipsis', () => {
    return cy.get('[data-testid="company-page-ellipsis"]');
});

Cypress.Commands.add('getCreateCompanyName', () =>{
    return cy.get('[data-testid="company-name"]');
});

Cypress.Commands.add('getCreateCompanyTagline', () => {
    return cy.get('[data-testid="company-tagline"]');
});

Cypress.Commands.add('getCreateCompanyOrganizationSize', () => {
    return cy.get('[data-testid="organization-size"]');
})

Cypress.Commands.add('getCreateCompanyOrganizationSize50', () => {
    return cy.get('[1-50Emp]');
})

Cypress.Commands.add('getCreateCompanyOrganizationType', () => {
    return cy.get('[data-testid="organization-type"]');
})

Cypress.Commands.add('getCreateCompanyOrganizationTypePublic', () => {
    return cy.get('[data-testid="PublicCompany"]');
})

Cypress.Commands.add('getCreateCompanyIndustry', () => {
    return cy.get('[data-testid="company-industry"]');
});

Cypress.Commands.add('getCreateCompanyOverview', () => {
    return cy.get('[data-testid="company-overview"]');
});

Cypress.Commands.add('getCreateCompanyFoundedYear', () => {
    return cy.get('[data-testid="company-founded"]');
});

Cypress.Commands.add('getCreateCompanyWebsite', () => {
    return cy.get('[data-testid="company-website"]');
});

Cypress.Commands.add('getCreateCompanyAddress', () => {
    return cy.get('[data-testid="company-address"]');
});

Cypress.Commands.add('getCreateCompanyLocation', () => {
    return cy.get('[data-testid="company-location"]');
});

Cypress.Commands.add('getCreateCompanyEmail', () => {
    return cy.get('[data-testid="company-email"]');
});

Cypress.Commands.add('getCreateCompanyPhone', () => {
    return cy.get('[data-testid="company-contactNumber"]');
});

Cypress.Commands.add('getCreateCompanyLogo', () => {
    return cy.get('[data-testid="company-logo-add"]');
});

Cypress.Commands.add('getCompanyAgreeement', () => {
    return cy.get('[data-testid="agree-terms"]');
});

Cypress.Commands.add('getCompanyPageSave', () => {
    return cy.get('[data-testid="create-page-button"]');
});






// *********************************************** EDIT COMPANY ***********************************************

Cypress.Commands.add('getEditCompanyOverview', () => {
    return cy.get(':nth-child(3) > .w-full');
});

Cypress.Commands.add('getEditCompanyDescription', () => {
    return cy.get(':nth-child(4) > .w-full');
});

Cypress.Commands.add('getEditCompanyIndustry', () => {
    return cy.get(':nth-child(5) > .w-full');
});

Cypress.Commands.add('getEditCompanyAddress', () => {
    return cy.get(':nth-child(6) > .w-full');
});

Cypress.Commands.add('getEditCompanyWebsite', () => {
    return cy.get(':nth-child(7) > .w-full');
});

Cypress.Commands.add('getEditCompanyPhone', () => {
    return cy.get(':nth-child(8) > .w-full');
});

Cypress.Commands.add('getEditCompanyVerification', () => {
    return cy.get(':nth-child(9) > .w-full');
});

Cypress.Commands.add('getEditCompanyEmail', () => {
    return cy.get(':nth-child(10) > .w-full');
});

Cypress.Commands.add('getEditCompanyFoundedYear', () => {
    return cy.get(':nth-child(11) > .w-full');
});

Cypress.Commands.add('getEditCompanySize', () => {
    return cy.get(':nth-child(12) > .w-full');
});

Cypress.Commands.add('getEditCompanyType', () => {
    return cy.get(':nth-child(13) > .w-full');
});

Cypress.Commands.add('getCompanyPageEdit', () => {
    return cy.get('[data-testid="EditCompanyButton"]')
});

Cypress.Commands.add('getEditSaveButton', () => {
    return cy.get('.justify-end > .px-4');
})


// *********************************************** COMPANY ***********************************************

Cypress.Commands.add('getCompanySubHeader', () => {
    return cy.get('.mt-8 > .text-companysubheader');
});

Cypress.Commands.add('getCompanyHome', () => {
    return cy.get('[data-testid="company-home-button"]');
});

Cypress.Commands.add('getCompanyAbout', () => {
    return cy.get('[data-testid="company-about-button"]');
});

Cypress.Commands.add('getCompanyPosts', () => {
    return cy.get('[data-testid="company-posts-button"]');
});

Cypress.Commands.add('getCompanyJobs', () => {
    return cy.get('[data-testid="company-jobs-button"]');
});

Cypress.Commands.add('getSchool', () => {
    return cy.get('[data-testid="school"]');
}
);

Cypress.Commands.add('navigateToCompanyPage', () => {
    cy.intercept('GET', '**/companies?**').as('searchCompanies');
    cy.intercept('GET', '**/posts/search/?**').as('searchPosts');
    cy.getNavbarSearch().type('TechVision Labs{enter}');
    cy.wait('@searchPosts').its('response.statusCode').should('eq', 200);
    cy.getSearchDropdown().click();
    cy.getSearchDropdownCompanies().click();
    cy.wait('@searchCompanies').its('response.statusCode').should('eq', 200);
    cy.getCompanySearch().first().click();
});


// *********************************************** COMPANY ***********************************************

Cypress.Commands.add('getPostJobButton', () => {
    return cy.get('.mb-8 > .flex > .bg-blue-600');
});

Cypress.Commands.add('getJobPosition', () => {
    return cy.get('[data-testid="position-input"]');
});

Cypress.Commands.add('getJobIndustry', () => {
    return cy.get('[data-testid="industry-input"]');
}); 

Cypress.Commands.add('getJobLocation', () => {
    return cy.get('[data-testid="location-input"]');
});

Cypress.Commands.add('getJobSalary', () => {
    return cy.get('[data-testid="salary-input"]');
});

Cypress.Commands.add('getJobEmploymentType', () => {
    return cy.get('[data-testid="employment-type-select"]');
});

Cypress.Commands.add('getJobLocationType', () => {
    return cy.get('[data-testid="location-type-select"]');
});

Cypress.Commands.add('getJobExperienceLevel', () => {
    return cy.get('[data-testid="experience-level-select"]');
});

Cypress.Commands.add('getJobDescription', () => {
    return cy.get('[data-testid="description-textarea"]');
});

Cypress.Commands.add('getJobSubmitButton', () => {
    return cy.get('[data-testid="submit-button"]');
});

Cypress.Commands.add('getJobApplyButton', () => {
    return cy.get('[data-testid="JobApplyButton"]');
});

Cypress.Commands.add('getJobApplicationEmail', () => {
    return cy.get('[data-testid="email-input"]');
});

Cypress.Commands.add('getJobApplicationMobile', () => {
    return cy.get('[data-testid="mobile-input"]');
});

Cypress.Commands.add('getJobApplicationExperience', () => {
    return cy.get('[data-testid="experience-input"]');
});

Cypress.Commands.add('getJobApplicationSalary', () => {
    return cy.get('[data-testid="salary-input"]');
});

Cypress.Commands.add('getJobApplicationAgree', () => {
    return cy.get('[data-testid="agree-input"]');
});

Cypress.Commands.add('getJobApplicationSubmit', () => {
    return cy.get('[data-testid="submit-button"]');
});
