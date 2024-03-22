const professsorGrantTitle = 'Research Info Test Grant Professor'
const professorPubTitle = 'Research Info Test Publication Professor'
const chairGrantTitle = 'Research Info Test Grant Chair'
const chairPubTitle = 'Research Info Test Publication Chair'

describe('Research Info Test: Professor', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Log In')
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('nonChairUserEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('nonChairUserPassword'))
    cy.contains('button', 'Log in').click()
    cy.url().should('include', '/dashboard') // make sure logged in
  })
  it("Professor Can Upload a Grant", () => {
    cy.visit(Cypress.env('baseUrl') + '/grantupload')
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type(professsorGrantTitle)
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')      
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that redirected to research-info and see grant
    cy.url().should('include', '/research-info')
    cy.contains(professsorGrantTitle)
  })
  it("Professor Can Upload a Publication", () => {
    // Visit pub info site
    cy.visit(Cypress.env('baseUrl') + '/pubupload')
    cy.contains('Publication Information')
    cy.contains('section', 'Publication Information').find('input')
      .eq(0).type(professorPubTitle)
    cy.contains('section', 'Publication Information').find('input')
      .eq(1).type('Tim Tests, Ellie Exams')
    cy.contains('section', 'Publication Information').find('input')
      .eq(2).type('2023')
    cy.contains('section', 'Publication Information').find('button').first().click()

    // Check that redirected to research-info and see pub
    cy.url().should('include', '/research-info')
    cy.contains(professorPubTitle)
  })
  it('Professor Can\'t choose other people', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.contains('Options').find('select').should('not.exist')
  })
})

describe('Research Info Test: Chair', () => {
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
  it("Chair Can Upload a Grant", () => {
    cy.visit(Cypress.env('baseUrl') + '/grantupload')
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type(chairGrantTitle)
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')      
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that redirected to research-info and see grant
    cy.url().should('include', '/research-info')
    cy.contains(chairGrantTitle)
  })
  it("Chair Can Upload a Publication", () => {
    // Visit pub info site
    cy.visit(Cypress.env('baseUrl') + '/pubupload')
    cy.contains('Publication Information')
    cy.contains('section', 'Publication Information').find('input')
      .eq(0).type(chairPubTitle)
    cy.contains('section', 'Publication Information').find('input')
      .eq(1).type('Tim Tests, Ellie Exams')
    cy.contains('section', 'Publication Information').find('input')
      .eq(2).type('2023')
    cy.contains('section', 'Publication Information').find('button').first().click()

    // Check that redirected to research-info and see pub
    cy.url().should('include', '/research-info')
    cy.contains(chairPubTitle)
  })
  it('Chair can choose other people and sees their info', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('div', 'Options').find('select').select(Cypress.env('nonChairUserName'))

    // Check grants
    cy.contains(professsorGrantTitle)

    // Check publications
    cy.contains('div', 'Options').contains('Publications').click()
    cy.contains(professorPubTitle)
  })
})
