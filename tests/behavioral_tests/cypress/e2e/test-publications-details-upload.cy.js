describe('Add Publication Test Spec', () => {
    // login before each
    beforeEach(() => {
      cy.visit(Cypress.env('loginUrl'))
      cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
      cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
      cy.contains('button', 'Log in').click()
  
      cy.url().should('include', '/dashboard') // make sure logged in

    })
    it('Can Access  Add Pub Page', () => {
      // just the beforeEach part
      // Test that on publication upload page
      cy.wait(100)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
    })
    it("Can't Add Pub Details without a title", () => {
      // Visit pub info site
      cy.wait(100)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(100)
      cy.contains('section', 'Publication Information').find('input')
        .eq(1).type('Quincy Quizzes, John Smith')
      cy.contains('section', 'Publication Information').find('input')
        .eq(2).type('2024')
      cy.contains('section', 'Publication Information').find('input')
        .eq(3).type('ISBN123')
      cy.contains('section', 'Publication Information').find('button').first().click()
  
      // Check that still on pub upload page and that error appears
      cy.contains('Add Publication Form')
      cy.contains('Please fill in all fields')
    })
    it("Can't Add Pub Details without Author(s)", () => {
      // Visit pub info site
      cy.wait(100)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(100)
      cy.contains('section', 'Publication Information').find('input')
        .eq(0).type('Test Publication')
      cy.contains('section', 'Publication Information').find('input')
        .eq(2).type('2024')
      cy.contains('section', 'Publication Information').find('input')
        .eq(3).type('ISBN123')
      cy.contains('section', 'Publication Information').find('button').first().click()
  
      // Check that still on pub upload page and that error appears
      cy.contains('Add Publication Form')
      cy.contains('Please fill in all fields')
    })
    it("Can't Add Publication Details without Year", () => {
      // Visit pub info site
      cy.wait(100)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(100)
      cy.contains('section', 'Publication Information').find('input')
        .eq(0).type('Test Publication')
      cy.contains('section', 'Publication Information').find('input')
        .eq(1).type('Quincy Quizzes, Tim Tests')
      cy.contains('section', 'Publication Information').find('button').first().click()

      // Check that still on Publication upload page and that error appears
      cy.contains('Add Publication Form')
      cy.contains('Please fill in all fields')
    })
    it("Can Add Publication without ISBN", () => {
      // Visit pub info site
      cy.wait(100)
      cy.visit(Cypress.env('baseUrl') + '/pubupload')
      cy.contains('Publication Information')
      cy.wait(100)
      cy.contains('section', 'Publication Information').find('input')
        .eq(0).type('Test Publication 11')
      cy.contains('section', 'Publication Information').find('input')
        .eq(1).type('Tim Tests, Ellie Exams')
      cy.contains('section', 'Publication Information').find('input')
        .eq(2).type('2023')      
      cy.contains('section', 'Publication Information').find('button').first().click()
  
      // Check that redirected to research info page or if test publication already exists
      cy.wait(100)
      cy.url().should('include', '/research-info')
      
      // Check that publication is on page
      cy.contains('Test Publication 11')
    })
  })