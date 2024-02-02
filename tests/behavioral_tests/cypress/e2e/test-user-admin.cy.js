describe('Test User Administration Functionality', () => {
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

    // Test that on grant upload page
    cy.visit(Cypress.env('baseUrl') + '/useradmin')
    cy.contains('User Administration')
  })

  it("Can Create a User", () => {
    cy.contains('section', 'Create a User').find('input').eq(0)
      .type('Some')
    cy.contains('section', 'Create a User').find('input').eq(1)
      .type('Professor')
    cy.contains('section', 'Create a User').find('input').eq(2)
      .type(Cypress.env('TmpTestProfessorEmail'))
    cy.contains('section', 'Create a User').find('select')
      .select('professor')
    cy.contains('section', 'Create a User').find('input').eq(3)
      .type(Cypress.env('TmpTestProfessorPassword'))
    cy.contains('section', 'Create a User').find('input').eq(4)
      .type(Cypress.env('TmpTestProfessorPassword'))

    cy.contains('button', 'Create').click()

    // Check that on dashboard page
    cy.url().should('include', '/dashboard')
  })

  it('Can Modify a User', () => {
    cy.contains('section', 'Update a User').find('input').eq(0)
      .type(Cypress.env('TmpTestProfessorEmail'))
    cy.contains('section', 'Update a User').find('input').eq(1)
      .type('SomeNewName')

    cy.contains('button', 'Update').click()

    // Check that on dashboard page
    cy.url().should('include', '/dashboard')
  })

  it("Can Delete a User", () => {
    cy.contains('section', 'Delete a User').find('input').eq(0)
      .type(Cypress.env('TmpTestProfessorEmail'))

    cy.contains('button', 'Delete').click()

    // Check that on dashboard page
    cy.url().should('include', '/dashboard')
  })
})