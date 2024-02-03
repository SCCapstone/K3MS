// Test if file is uploaded to the database and is parsed succesfully
// pull data from database after its been uploaded

describe('Parse Student Evaluations Test', () => { 

    it('Test Successful Upload of Evaluation', () => {
        // Log In
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/dashboard') // make sure logged in

        // Check that there arent any courses there now
        cy.contains('Students Evals').click()
        Cypress.env('coursesInStudentEvalSampleForTestUser').forEach((course) => {
            cy.contains(course).should('not.exist');
        })

        // Test that on evaluation upload page
        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('Upload Student Evaluations Form')

        // Upload file
        const filename = Cypress.env('studentEvalSampleFN')
        cy.contains('section', 'Upload').get('input[type=file]')
            .selectFile('cypress/fixtures/' + filename)

        // Submit
        cy.contains('section', 'Upload').contains('button', 'Upload').click()

        // Check that redirected to student evals page
        cy.url().should('include', '/student-evals')

        // Check that courses show up on page
        Cypress.env('coursesInStudentEvalSampleForTestUser').forEach((course) => {
            cy.contains(course);
        })
    })
})