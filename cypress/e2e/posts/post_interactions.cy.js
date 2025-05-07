describe('open news feed', () => {
    beforeEach(() => {
      cy.fixture('users.json').then((users) => {
        cy.login(users.userDallas);
      });
      cy.visit('http://localhost:5173/feed');

    });

    describe('Post interactions', () => {
        it('Creates a Post', () => {
            cy.getSearchDropdown().click();
            cy.getCreatePostInput().click().type('This is a test post');
            cy.getCreatePostButton().click();
            cy.getPost().first().should('contain', 'This is a test post');
        });

        it('Edits a Post', () => {
            cy.getPost().first().within(() => {
                cy.getPostEllipsis().click();
                cy.getPostEllipsisEdit().click();
            });
            cy.getCreatePostInput().clear().type('This is an edited test post');
            cy.getCreatePostButton().click();
            cy.getPost().first().should('contain', 'This is an edited test post');
        });

        it('Adds a Comment', () => {
            cy.getPost().first().within(() => {
                cy.getPostCommentShow().click();
            });
            cy.getPostCommentInput().type('This is a test comment');
            cy.getPostCommentButton().click();
            cy.getPostComment().first().should('contain', 'This is a test comment');    
        })

        it('Deletes a Post', () => {
            cy.getPost().first().within(() => {
                cy.getPostEllipsis().click();
                cy.getPostEllipsisDelete().click();
                cy.getPostDeleteButton().click();
            });
            cy.getPost().first().should('not.contain', 'This is an edited test post');
        }); 
    });

    describe('Post interactions With attachments', () => {
        it('Creates a Post', () => {
            cy.getCreatePost().click();
            cy.getCreatePostInput().click().type('This is a test post with attachments');
            cy.getAddMediaButton().click();
            cy.get('input[type="file"]').selectFile('cypress/fixtures/t-stat.png', { force: true });
            cy.getRemoveMediaButton().should('be.visible');    
            cy.getCreatePostButton().click();
            cy.getPost().first().should('contain', 'This is a test post with attachments');
        });

        it('Deletes a Post ', () => {
            cy.getPost().first().within(() => {
                cy.getPostEllipsis().click();
                cy.getPostEllipsisDelete().click();
                cy.getPostDeleteButton().click();
            });
            cy.getPost().first().should('not.contain', 'This is a test post with attachments');
        }); 

        it('Creates a Post', () => {
            cy.getCreatePost().click();
            cy.getCreatePostInput().click().type('This is a test post with attachments');
            cy.getAddMediaButton().click();
            cy.get('input[type="file"]').selectFile('cypress/fixtures/t-stat.png', { force: true });
            cy.getRemoveMediaButton().should('be.visible');    
            cy.getCreatePostButton().click();
            cy.getPost().first().should('contain', 'This is a test post with attachments');
        });

        it('Edits a Post removing attachments', () => {
            cy.getPost().first().within(() => {
                cy.getPostEllipsis().click();
                cy.getPostEllipsisEdit().click();
            });
            cy.getCreatePostInput().clear().type('This is an edited test post without an attachments');
            cy.getRemoveMediaButton().click();
            cy.getRemoveMediaButton().should('not.exist');
            cy.getCreatePostButton().click();
            cy.getPost().first().should('contain', 'This is an edited test post without an attachments');
        });

        it('Deletes a Post', () => {
            cy.getPost().first().within(() => {
                cy.getPostEllipsis().click();
                cy.getPostEllipsisDelete().click();
                cy.getPostDeleteButton().click();
            });
            cy.getPost().first().should('not.contain', 'This is an edited test post without an attachments');
        }); 
    }); 
  });