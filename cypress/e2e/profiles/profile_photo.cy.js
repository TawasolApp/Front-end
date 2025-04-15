describe("adds, updates, deletes profile photo", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173");
      cy.getUpperRegistrationButton().click();
    });
  
    it("interacts with profile photo", () => {
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

      // get og image (should empty)
      cy.get('img[alt="Profile"]').invoke('attr', 'src').should('include', 'src/assets/images/defaultProfilePicture.png');
      cy.get('img[alt="Profile"]').invoke('attr', 'src').as('originalSrc');  
  
      // add profile photo
      cy.get('.justify-start > .relative > .absolute').click();
      cy.wait(2000);
      cy.get('[data-testid="file-input"]').attachFile('imgs/polar_bear.png', { force: true });
      cy.wait(5000);
      cy.get('.mt-5 > .text-white').click();

      // assert photo is added
      cy.get('@originalSrc').then((originalSrc) => {
        cy.get('img[alt="Profile"]')
          .should('have.attr', 'src')
          .and('not.eq', originalSrc);
      });

      // get new image
      cy.get('img[alt="Profile"]')
      .invoke('attr', 'src')
      .as('newSrc');

      // update profile photo
      cy.get('.justify-start > .relative > .absolute').click();
      cy.wait(2000);
      cy.get('[data-testid="file-input"]').attachFile('imgs/orca.png', { force: true });
      cy.wait(5000);
      cy.get('.mt-5 > .text-white').click();
      
      // assert photo is updated
      cy.get('@newSrc').then((newSrc) => {
        cy.get('img[alt="Profile"]')
          .should('have.attr', 'src')
          .and('not.eq', newSrc);
      });

      // get newer image
      cy.get('img[alt="Profile"]')
      .invoke('attr', 'src')
      .as('newerSrc');

      // delete profile photo
      cy.get('.justify-start > .relative > .absolute').click();
      cy.wait(2000);
      cy.get('.mt-5 > .text-white').click();
      cy.wait(2000);
      cy.get('[data-testid="confirm-modal"]').click();

      // assert no image is attached
      cy.get('img[alt="Profile"]').invoke('attr', 'src').should('include', 'src/assets/images/defaultProfilePicture.png');

    });
  });
  