describe('template spec', () => {
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

    // Test that on grant upload page
    cy.visit(Cypress.env('baseUrl') + 'grantupload')
    cy.contains('Upload Grant Form')
  })
  it('Can Acces Grant Upload Page', () => {
    // just the beforeEach part
  })
  it("Can't Upload Grant without a title", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that still on grant upload page and that error appears
    cy.contains('Upload Grant Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Upload Grant without Amount", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type('Test Grant')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that still on grant upload page and that error appears
    cy.contains('Upload Grant Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Upload Grant without Year", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type('Test Grant')
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that still on grant upload page and that error appears
    cy.contains('Upload Grant Form')
    cy.contains('Please fill in all fields')
  })
  it("Can Upload Grant", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type('Test Grant')
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')      
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that redirected to research info page
    cy.url().should('include', '/research-info')
  })

  // TODO finish this test once there is a way to delete existing grants
})