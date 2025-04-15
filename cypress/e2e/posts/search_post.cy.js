describe('Search Posts & Interactions', () => {
    let user;
    beforeEach(() => {
      cy.fixture('users.json').then((users) => {
        user = users.userDallas;
        cy.login(user);
      });
      cy.visit('http://localhost:5173/feed');
      cy.getNavbarSearch().type('Taceo{enter}');
    });

    it('Searches for a post', () => {
        cy.getPost().first().within(() => {
            cy.contains('Textilis atqui thesaurus. Taceo aqua carmen. Aestivus quae pax solio talio cursus mollitia.').should('exist');
        });
    });

    it('Adds a like to a post', () => {
        cy.getPost().first().within(() => {
            cy.getPostLikeCount().should('have.text', '5');
            cy.getPostReact().click();
            cy.getPostLikeCount().should('have.text', '6');
            cy.getPostReact().click();
            cy.getPostLikeCount().should('have.text', '5');
        });
    });

    it('Adds a Comment', () => {
        cy.getPost().first().within(() => {
            cy.getPostCommentShow().click();
        });
        cy.getPostCommentCount().should('have.text', '1 comment');
        cy.getPostCommentInput().type('This is a test comment');
        cy.getPostCommentButton().click();
        cy.getPostComment().first().should('contain', 'This is a test comment');
        cy.getPostCommentCount().should('have.text', '2 comments');
    })

    it('Deletes a Comment', () => {
        cy.getPost().first().within(() => {
            cy.getPostCommentShow().click();
        });
        cy.getPostComment().first().within(() => {
            cy.getPostCommentEllipsis().click();
            cy.getPostCommentEllipsisDelete().click();
        });
        cy.getPostCommentCount().should('have.text', '1 comment');
    });
    
    //SEED FOR THIS TO PASS (Cannot remove repost)
    it('Reposts a post', () => {
        cy.getPostRepostCount().should('have.text', '2 reposts'); 
        cy.getPost().first().within(() => {
            cy.getPostRepost().click();
            cy.getPostEllipsisRepost().click();
        });
        cy.getPostRepostCount().should('have.text', '3 reposts'); 
        cy.visit('http://localhost:5173/feed');
        cy.getPost().first().within(() => {
            cy.contains("Textilis atqui thesaurus. Taceo aqua carmen. Aestivus quae pax solio talio cursus mollitia.")
        });
    });

    it('Saves a post', () => {
        cy.intercept('POST', '**/posts/save/**').as('savePost');
        cy.getPost().first().within(() => {
            cy.getPostEllipsis().click();
            cy.getPostEllipsisSave().click();
        });
        cy.wait('@savePost');   
        cy.visit('http://localhost:5173/my-items/saved-posts');
        cy.getPost().first().within(() => {
            cy.contains("Textilis atqui thesaurus. Taceo aqua carmen. Aestivus quae pax solio talio cursus mollitia.")
        });
    });

    it('unsaves a post', () => {
        cy.intercept('DELETE', '**/posts/save/**').as('deletePost');
        cy.visit('http://localhost:5173/my-items/saved-posts');
        cy.getPost().first().within(() => {
            cy.getPostEllipsis().click();
            cy.getPostEllipsisUnsave().click();
        });
        cy.wait('@deletePost');   
        cy.visit('http://localhost:5173/my-items/saved-posts');
        cy.contains('No posts yet').should('be.visible');
    });
  });