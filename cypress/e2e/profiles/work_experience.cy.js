describe("adds, updates, deletes work experience", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173");
      cy.getUpperRegistrationButton().click();
    });
  
    it("interacts with work experience", () => {
      let user = {
        email: "",
        password: "07032004",
      };
      const randomString = Math.random().toString(36).substring(2, 10);
      user.email = `${randomString}@mailinator.com`;
      const inboxName = randomString;
      cy.register(user, inboxName);
  
      // go to profile
      cy.get("div.relative > .flex-col > .flex > span").click();
      cy.get(".border-b > .p-4").click();
      cy.get("div.relative > .flex-col > .flex > span").click();

      cy.wait(5000);

      // assert existence of experience added during registration
      cy.contains("Software Developer").should('be.visible');
      cy.get('.text-sm.text-companyheader.font-medium').should('contain.text', 'Tawasol').and('contain.text', 'internship');
      cy.contains("Jul 2024").should('be.visible');

      // add work experience
      cy.get(':nth-child(4) > .p-6 > .justify-between > .gap-0 > :nth-child(1)').click();
      cy.get('#title').type("Consultant");
      cy.get('#employmentType').select("Contract");
      cy.get('#company').type("Apple");
      cy.get('#currentlyWorking').check();
      cy.get('#startMonth').select("January");
      cy.get('#startYear').select("2020");
      cy.get('[data-testid="save-button"]').click();

      cy.wait(5000);

      // assert existence
      cy.get(':nth-child(2) > .bg-boxbackground > .pr-8 > .flex > .break-all > .text-lg').should('include.text', 'Consultant');
      cy.get('.text-sm.text-companyheader.font-medium').should('contain.text', 'Apple').and('contain.text', 'contract');
      cy.contains("Jan 2020").should('be.visible');
      
      // edit work experience
      cy.get('.gap-0 > :nth-child(2)').click();
      cy.get('.space-y-4 > :nth-child(2) > .absolute').click();
      cy.get('#location').type("New York");
      cy.get('#locationType').select("Hybrid");
      cy.get('#description').type("Worked as a consultant for Apple.");
      cy.get('#currentlyWorking').uncheck();
      cy.get('#endMonth').select("March");
      cy.get('#endYear').select("2025");
      cy.get('[data-testid="save-button"]').click();
      cy.get('.gap-2 > .w-10').click();

      cy.wait(5000);

      // assert existence of updates
      cy.get(':nth-child(2) > .bg-boxbackground > .pr-8 > .flex > .break-all > .text-lg').should('include.text', 'Consultant');
      cy.get('.text-sm.text-companyheader.font-medium').should('contain.text', 'Apple').and('contain.text', 'contract');
      cy.contains("Jan 2020").should('be.visible');
      cy.contains("New York").should('be.visible');
      cy.contains("Hybrid").should('be.visible');
      cy.contains("Worked as a consultant for Apple.").should('be.visible');
      cy.contains("Mar 2025").should('be.visible');

      // delete work experience
      cy.get('.gap-0 > :nth-child(2)').click();
      cy.get('.space-y-4 > :nth-child(2) > .absolute').click();
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="confirm-modal"]').click();
      cy.get('.gap-2 > .w-10').click();

      cy.wait(5000);

      // assert non-existence of updates
      cy.contains("Consultant").should('not.exist');
      cy.contains("Apple").should('not.exist');
      cy.contains("contract").should('not.exist');
      cy.contains("Jan 2020").should('not.exist');
      cy.contains("New York").should('not.exist');
      cy.contains("Hybrid").should('not.exist');
      cy.contains("Worked as a consultant for Apple.").should('not.exist');
      cy.contains("Mar 2025").should('not.exist');
    });
  });
  