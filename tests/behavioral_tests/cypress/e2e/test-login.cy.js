describe('Test Login Functionality', () => {
  it('can access the login page', () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.contains('Log In')
  })

  it("Can't Login Without Password", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('button', 'Log in').click()

    // Check that still on login page and that error appears
    cy.contains('Log In')
    cy.contains('Please fill in all fields')
  })
  it("Can't Login Without Email", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    // Check that still on login page and that error appears
    cy.contains('Log In')
    cy.contains('Please fill in all fields')
  })
  it("Can't Login With Incorrect Email", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testIncorrectEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    // Check that still on login page and that error appears
    cy.contains('Log In')
    cy.contains('User does not exist')
  })
  it("Can't Login With Incorrect Password", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testIncorrectPassword'))
    cy.contains('button', 'Log in').click()

    // Check that still on login page and that error appears
    cy.contains('Log In')
    cy.contains('Incorrect password')
  })
  it("Can Login", () => {
    cy.visit(Cypress.env('loginUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    // Check that on dashboard page
    cy.url().should('include', '/dashboard')
  })
})