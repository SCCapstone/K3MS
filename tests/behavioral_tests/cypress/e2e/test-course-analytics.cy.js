describe('Test Course Analytics Page', () => {
  it("Data is Correct for Different Times", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.wait(100)
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
    cy.get('.analyticsTable').find('td').eq(2).contains(Cypress.env('expectedCourseMeanAllTime'))

    // Select a new time period
    cy.get('.choosePeriodDropdown').find('select')
      .select('Last Year')

    // Check mean is as expected for all time
    cy.get('.analyticsTable').find('td').eq(2).contains(Cypress.env('expectedCourseMeanOneYear'))
  })
  it("Chair can see data for other users", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.wait(100)
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in

     // Go to course analytics page
     cy.contains('Course Analytics').click()

     // Select a user
     cy.contains('Choose Person').get('input').eq(0).type(Cypress.env('nonChairUserName'))
     cy.get('.searchDropdownItem').eq(0).click()

    cy.get('.analyticsTable').find('th').eq(3).contains(Cypress.env('nonChairUserName'))
  })
  it("Non-chair cannot see data for other users", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.wait(100)
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