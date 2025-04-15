describe("adds, updates, deletes education/certification", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173");
      cy.getUpperRegistrationButton().click();
    });
  
    it("interacts with education", () => {
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

      // assert no education added
      cy.get(':nth-child(3) > .bg-boxbackground > .text-normaltext').should('include.text', 'No education added yet.');

      // add education
      cy.get(':nth-child(3) > .bg-boxbackground > .justify-between > .gap-0 > .w-8').click();
      cy.get('#school').type("Cairo University");
      cy.get('#degree').type("Bachelor's");
      cy.get('#field').type("Engineering");
      cy.get('#startMonth').select("October");
      cy.get('#startYear').select("2013");
      cy.get('#endMonth').select("June");
      cy.get('#endYear').select("2017");
      cy.get('[data-testid="save-button"]').click();

      cy.wait(5000);

      // assert existence
      cy.get('[data-testid="school"]').should('include.text', 'Cairo University');
      cy.get('.break-all > p.text-companyheader').should('contain.text', 'Bachelor\'s').and('contain.text', 'Engineering');
      cy.contains("Oct 2013").should('be.visible');
      cy.contains("Jun 2017").should('be.visible');
      
      // edit education
      cy.get(':nth-child(3) > .p-6 > .justify-between > .gap-0 > :nth-child(2)').click();
      cy.get('.group > .absolute').click();
      cy.get('#grade').type("3.21 GPA");
      cy.get('#description').type("Studied at Cairo University");
      cy.get('[data-testid="save-button"]').click();
      cy.get('.gap-2 > .w-10').click();

      cy.wait(5000);

      // assert existence of updates
      cy.get('[data-testid="school"]').should('include.text', 'Cairo University');
      cy.get('.break-all > p.text-companyheader').should('contain.text', 'Bachelor\'s').and('contain.text', 'Engineering');
      cy.contains("Oct 2013").should('be.visible');
      cy.contains("Jun 2017").should('be.visible');
      cy.contains("3.21 GPA").should('be.visible');
      cy.contains("Studied at Cairo University").should('be.visible');

      // delete education
      cy.get(':nth-child(3) > .p-6 > .justify-between > .gap-0 > :nth-child(2)').click();
      cy.get('.group > .absolute').click();
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="confirm-modal"]').click();
      cy.get('.gap-2 > .w-10').click();

      cy.wait(5000);

      // assert non-existence of updates
      cy.contains("Cairo University").should('not.exist');
      cy.contains("Engineering").should('not.exist');
      cy.contains("Bachelor's").should('not.exist');
      cy.contains("Oct 2013").should('not.exist');
      cy.contains("Jun 2017").should('not.exist');
      cy.contains("3.21 GPA").should('not.exist');
      cy.contains("Studied at Cairo Unversity.").should('not.exist');
    });
  });
  