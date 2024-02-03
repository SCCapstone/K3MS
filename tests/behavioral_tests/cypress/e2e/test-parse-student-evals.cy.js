// Test if file is uploaded to the database and is parsed succesfully
// pull data from database after its been uploaded

// should get 200 status
// then make sure with a GET request that the file is there

describe('Parse Student Evaluations Test', () => { 

    it('Test Successful Upload of Evaluation', () => {
        // Log In
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.contains('Log In')

        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/dashboard') // make sure logged in

        // Test that on evaluation upload page
        cy.visit(Cypress.env('baseUrl') + '/evalupload')
        cy.contains('Upload Student Evaluations Form')

        // Upload file
        const filename = Cypress.env('studentEvalSampleFN')
        cy.fixture(filename).then(fileContent => {
            cy.contains('section', 'Upload').get('input[type=file]').attachFile({
                fileContent: fileContent.toString(),
                fileName: filename,
                mimeType: 'application/vnd.ms-excel'
            })
        })

        // Submit
        cy.contains('section', 'Upload').contains('button', 'Upload').click()

    })
    // it('If Logged Out Return No Grants', () => {
    //     cy.request({
    //       url: Cypress.env('baseUrl') + '/grants',
    //       followRedirect: false,
    //       failOnStatusCode: false,
    //     }).then((response) => {
    //       expect(response.status).to.equal(401)
    //     })
    //   })


})