describe('Test Student Evals Page - Professor', () => { 
  beforeEach(() => {
    // Log In as PROFESSOR
    cy.visit(Cypress.env('baseUrl') + '/login')
    cy.contains('section', 'Log In').find('input').first()
    .type(Cypress.env('nonChairUserEmail'))
    cy.contains('section', 'Log In').find('input').last()
    .type(Cypress.env('nonChairUserPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in
  })
  it("Data is Correct", () => {
    cy.visit(Cypress.env('baseUrl') + '/student-evals')
    cy.contains('CSCE350').parent().contains(3.40)
    cy.contains('CSCE587').parent().contains(6.50)
  })
  it("Can't Choose Other Users", () => {
    cy.visit(Cypress.env('baseUrl') + '/student-evals')
    cy.contains('Choose Person').should('not.exist')
  })
})
describe('Test Student Evals Page - Chair', () => { 
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + '/login')
    cy.contains('section', 'Log In').find('input').first()
    .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
    .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()
    cy.url().should('include', '/dashboard') // make sure logged in
  })
  it('Data is Correct', () => {
    cy.visit(Cypress.env('baseUrl') + '/student-evals')
    cy.contains('CSCE240').parent().contains(4.89)
    cy.contains('CSCE491').parent().contains(3.50)
  })
  it('Can Choose Other Users', () => {
    cy.visit(Cypress.env('baseUrl') + '/student-evals')

    cy.contains('Choose Person').get('input').eq(0).type('Timothy Exams')
    cy.get('.searchDropdownItem').eq(0).click()

    cy.contains('CSCE350').parent().contains(3.40)
    cy.contains('CSCE587').parent().contains(6.50)
  })
  it('Can click button to see details', () => {
    cy.visit(Cypress.env('baseUrl') + '/student-evals')
    cy.contains('Choose Person').get('input').eq(0).type('Timothy Exams')
    cy.get('.searchDropdownItem').eq(0).click()
    cy.contains('CSCE350').parent().find('button').click()
    cy.contains('CSCE350')
    cy.contains('Spring 2023 001')
  })
})