describe('Add Expenditure Test Spec', () => {
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

    // Test that on expen upload page
    cy.wait(100)
    cy.visit(Cypress.env('baseUrl') + '/expenupload')
    cy.contains('Add Expenditure Form')
  })
  it('Can Access Add Expenditure Page', () => {
    // just the beforeEach part
  })
  it("Can't Add Expenditure without a year", () => {
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(2).type('Test Lab')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(3).type('Johnny Test')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that still on expen upload page and that error appears
    cy.contains('Add Expenditure Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Add Expenditure without amount", () => {
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(0).type('1950')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(2).type('Test Lab')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(3).type('Johnny Test')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that still on expen upload page and that error appears
    cy.contains('Add Expenditure Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Add Expenditure without department", () => {
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(0).type('1950')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(3).type('Johnny Test')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that still on expen upload page and that error appears
    cy.contains('Add Expenditure Form')
    cy.contains('Please fill in all fields')
  })
  it("Can't Add Expenditure without PI", () => {
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(0).type('1950')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(2).type('Test Lab')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that still on expen upload page and that error appears
    cy.contains('Add Expenditure Form')
    cy.contains('Please fill in all fields')
  })
  it("Can Add an Expenditure", () => {
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(0).type('1950')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(2).type('Test Lab')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(3).type('Johnny Test')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that redirected to research info page
    cy.wait(100)
    cy.url().should('include', '/research-info')

    // Check that expen appears
    cy.contains('1950')
  })
})