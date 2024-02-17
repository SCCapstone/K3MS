describe('Publication Details Upload Test Spec', () => {
    // login before each
    beforeEach(() => {
      cy.visit(Cypress.env('baseUrl'))
      cy.contains('Log In')
  
      cy.visit(Cypress.env('baseUrl'))
      cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
      cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
      cy.contains('button', 'Log in').click()
  
      cy.url().should('include', '/dashboard') // make sure logged in

    })
    it('Can Access Pub Details Upload Page', () => {
      // just the beforeEach part
      // Test that on publication upload page
      cy.wait(500)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
    })
    it("Can't Upload Pub Details without a title", () => {
      // Visit pub info site
      cy.wait(500)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(500)
      cy.contains('section', 'Publication Information').find('input')
        .eq(1).type('Quincy Quizzes, John Smith')
      cy.contains('section', 'Publication Information').find('input')
        .eq(2).type('2024')
      cy.contains('section', 'Publication Information').find('input')
        .eq(3).type('ISBN123')
      cy.contains('section', 'Publication Information').find('button').first().click()
  
      // Check that still on pub upload page and that error appears
      cy.contains('Upload Publication Form')
      cy.contains('Please fill in all fields')
    })
    it("Can't Upload Pub Details without Author(s)", () => {
      // Visit pub info site
      cy.wait(500)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(500)
      cy.contains('section', 'Publication Information').find('input')
        .eq(0).type('Test Publication')
      cy.contains('section', 'Publication Information').find('input')
        .eq(2).type('2024')
      cy.contains('section', 'Publication Information').find('input')
        .eq(3).type('ISBN123')
      cy.contains('section', 'Publication Information').find('button').first().click()
  
      // Check that still on pub upload page and that error appears
      cy.contains('Upload Publication Form')
      cy.contains('Please fill in all fields')
    })
    it("Can't Upload Publication Details without Year", () => {
      // Visit pub info site
      cy.wait(500)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(500)
      cy.contains('section', 'Publication Information').find('input')
        .eq(0).type('Test Publication')
      cy.contains('section', 'Publication Information').find('input')
        .eq(1).type('Quincy Quizzes, Tim Tests')
      cy.contains('section', 'Publication Information').find('button').first().click()

      // Check that still on Publication upload page and that error appears
      cy.contains('Upload Publication Form')
      cy.contains('Please fill in all fields')
    })
    it("Can Upload Publication without ISBN", () => {
      // Visit pub info site
      cy.wait(500)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(500)
      cy.contains('section', 'Publication Information').find('input')
        .eq(0).type('Test Publication 11')
      cy.contains('section', 'Publication Information').find('input')
        .eq(1).type('Tim Tests, Ellie Exams')
      cy.contains('section', 'Publication Information').find('input')
        .eq(2).type('2023')      
      cy.contains('section', 'Publication Information').find('button').first().click()
  
      // Check that redirected to research info page or if test publication already exists
      cy.wait(500)
      cy.url().should('include', '/research-info')
    })
  })