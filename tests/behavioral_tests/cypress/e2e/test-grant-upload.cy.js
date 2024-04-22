describe('Grant Upload Test Spec', () => {
  // login before each
  beforeEach(() => {
    cy.visit(Cypress.env('loginUrl'))
    cy.wait(100)
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in

    // Test that on grant upload page
    cy.wait(100)
    cy.visit(Cypress.env('baseUrl') + '/grantupload')
    cy.wait(100)
    cy.contains('Add Grant Form')
  })
  it('Can Access Grant Upload Page', () => {
    // just the beforeEach part
  })
  it("Can't Add Grant without a title", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that still on grant upload page and that error appears
    cy.contains('Add Grant Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Add Grant without Amount", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type('Test Grant')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that still on grant upload page and that error appears
    cy.contains('Add Grant Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Add Grant without Year", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type('Test Grant')
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that still on grant upload page and that error appears
    cy.contains('Add Grant Form')
    cy.contains('Please fill in all fields')
  })
  it("Can Add Grant", () => {
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type('Test Grant')
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')      
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that redirected to research info page
    cy.wait(100)
    cy.url().should('include', '/research-info')

    // Check that grant appears
    cy.contains('Test Grant')
  });
})