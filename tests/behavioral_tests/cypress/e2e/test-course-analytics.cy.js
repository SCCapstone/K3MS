describe('Test Course Analytics Page', () => {
  it("Data is Correct for Different Times", () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Log In')

    cy.visit(Cypress.env('baseUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in

    // Go to course analytics page
    cy.contains('Course Analytics').click()

    // Select a course
    cy.get('.chooseCourseDropdown').find('select')
      .select(Cypress.env('coursesInStudentEvalSampleForTestUser')[0])

    // Check mean is as expected for default time period (1 year)
    cy.get('.analyticsTable').find('td').eq(2).contains(Cypress.env('expectedCourseMeanOneYear'))

    // Select a new time period
    cy.get('.choosePeriodDropdown').find('select')
      .select('All Time')

    // Check mean is as expected for all time
    cy.get('.analyticsTable').find('td').eq(2).contains(Cypress.env('expectedCourseMeanAllTime'))
  })
  it("Chair can see data for other users", () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Log In')

    cy.visit(Cypress.env('baseUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in

     // Go to course analytics page
     cy.contains('Course Analytics').click()

     // Select a user
     cy.get('.choosePersonDropdown').find('select')
      .select(Cypress.env('nonChairUserEmail'))
    
    cy.get('.analyticsTable').find('th').eq(3).contains(Cypress.env('nonChairUserName'))
  })
  it("Non-chair cannot see data for other users", () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Log In')

    cy.visit(Cypress.env('baseUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('nonChairUserEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('nonChairUserPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in

     // Go to course analytics page
     cy.contains('Course Analytics').click()

     cy.contains('Choose Person').should('not.exist')
  })
})