const professsorGrantTitle = 'Research Info Test Grant Professor'
const professorPubTitle = 'Research Info Test Publication Professor'
const professorExpenYear = '2005'
const chairGrantTitle = 'Research Info Test Grant Chair'
const chairPubTitle = 'Research Info Test Publication Chair'
const chairExpenYear = '2006'

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
  it("Professor Can Add a Grant", () => {
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
  it("Professor Can Add a Publication", () => {
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
  it("Professor Can Add an Expenditure", () => {
    // Visit expen add form
    cy.visit(Cypress.env('baseUrl') + '/expenupload')
    cy.contains('Expenditure Information')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(0).type(professorExpenYear)
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(1).type(10000)
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(2).type('Testing Lab')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(3).type('Testing PI')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that redirected to research-info and see expen
    cy.url().should('include', '/research-info')

    // Check that expenditure is there
    cy.contains(professorExpenYear)
  })
  it('Professor Can\'t choose other people', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.contains('Choose Person').should('not.exist')
  })
})


describe('Research Info Test: Chair', () => {
  beforeEach(() => {
  cy.wait(100)
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
  it("Chair Can Add an Expenditure", () => {
    // Visit expen add form
    cy.visit(Cypress.env('baseUrl') + '/expenupload')
    cy.contains('Expenditure Information')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(0).type(chairExpenYear)
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(1).type(10000)
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(2).type('Testing Lab')
    cy.contains('section', 'Expenditure Information').find('input')
      .eq(3).type('Testing PI')
    cy.contains('section', 'Expenditure Information').find('button').first().click()

    // Check that redirected to research-info and see expen
    cy.url().should('include', '/research-info')

    // Check that expenditure is there
    cy.contains(chairExpenYear)
  })
  it('Chair can choose other people and sees their info', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('Choose Person').get('input').eq(0).type(Cypress.env('nonChairUserName'))
    cy.get('.searchDropdownItem').eq(0).click()
    // Check grants
    cy.contains(professsorGrantTitle)

    // Check publications
    cy.contains('div', 'Choose Page').contains('Publications').click()
    cy.contains(professorPubTitle)

    // Check expenditures
    cy.contains('div', 'Choose Page').contains('Expenditures').click()
    cy.contains(professorExpenYear)
  })
})
