// Test if file is uploaded to the database and is parsed succesfully
// pull data from database after its been uploaded

describe('Parse Student Evaluations Test', () => { 
    beforeEach(() => {
        // Log In
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/dashboard') // make sure logged in

    })
    it('Test Can\'t Submit form without file', () => {
        // Test that on evaluation upload page
        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('Upload Student Evaluations Form')

        // Submit
        cy.contains('section', 'Upload').contains('button', 'Upload').click()

        // Check that still on eval upload page and that error appears
        cy.contains('Upload Student Evaluations Form')
        cy.contains('No file selected')
    })

    it('Test Can\'t Submit form with incorrect file format', () => {
        // Test that on evaluation upload page
        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('Upload Student Evaluations Form')

        const filename = Cypress.env('studentEvalSampleFN')
        cy.contains('section', 'Upload').get('input[type=file]')
            .selectFile('cypress/e2e/test-parse-student-evals.cy.js')
        
        // Submit
        cy.contains('section', 'Upload').contains('button', 'Upload').click()

        // Check that still on eval upload page and that error appears
        cy.contains('Upload Student Evaluations Form')
        cy.contains('Error uploading file - File extension not allowed')
    })

    it('Test Successful Upload of Evaluation', () => {
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
    it('Test Don\'t Overwrite Evaluation', () => {
        // Test that on evaluation upload page
        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('Upload Student Evaluations Form')

        // Upload file
        const filename = Cypress.env('modifiedEvalSampleFN')
        cy.contains('section', 'Upload').get('input[type=file]')
            .selectFile('cypress/fixtures/' + filename)
        
        // Submit
        cy.contains('section', 'Upload').contains('button', 'Upload').click()

        cy.wait(100)

        // Check that skipped rows appears on page
        cy.contains('Some Rows Were Skipped')

        // Check that rows to overwrite appear
        cy.contains('Rows Already Exist').parent().contains('CSCE240')
        cy.contains('Rows Already Exist').parent().contains('CSCE491')

        // Check that rows with missing data appear
        cy.contains('Rows Were Skipped For Various Reasons').parent().find('table').find('tr').should('have.length', 4)

        // Submit
        cy.contains('Ignore All').click()

        // Check redirected to student evals page
        cy.url().should('include', '/student-evals')

        // Check that intstructor mean for CSCE240 is updated but not for CSCE491
        cy.contains('CSCE240').parent().contains('5')   // oldvalue
        cy.contains('CSCE491').parent().contains('6.2') // old value
    })
    it('Test Overwrite Evaluation', () => {
        // Test that on evaluation upload page
        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('Upload Student Evaluations Form')

        // Upload file
        const filename = Cypress.env('modifiedEvalSampleFN')
        cy.contains('section', 'Upload').get('input[type=file]')
            .selectFile('cypress/fixtures/' + filename)
        
        // Submit
        cy.contains('section', 'Upload').contains('button', 'Upload').click()

        cy.wait(100)

        // Check that skipped rows appears on page
        cy.contains('Some Rows Were Skipped')

        // Check that rows to overwrite appear
        cy.contains('Rows Already Exist').parent().contains('CSCE240')
        cy.contains('Rows Already Exist').parent().contains('CSCE491')

        // Check that rows with missing data appear
        cy.contains('Rows Were Skipped For Various Reasons').parent().find('table').find('tr').should('have.length', 4)

        // Select some rows to overwrite
        cy.contains('CSCE240').parent().find('input').click()

        // Submit
        cy.contains('Overwrite Selected').click()

        // Check redirected to student evals page
        cy.url().should('include', '/student-evals')

        // Check that intstructor mean for CSCE240 is updated but not for CSCE491
        cy.contains('CSCE240').parent().contains('10')  // new value
        cy.contains('CSCE491').parent().contains('6.2') // old value
    })
})