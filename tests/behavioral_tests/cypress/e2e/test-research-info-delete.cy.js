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

    // Check that redirected to research-info
    cy.url().should('include', '/research-info')

    // Check that grant is there
    cy.contains('button', 'GRANTS').click()
    cy.contains(professsorGrantTitle)

    // Delete the grant
    cy.contains('button', 'delete').click()
    cy.on('window:confirm', () => { return true; });
    cy.contains(professsorGrantTitle).should('not.exist')

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

    // Check that publication is there
    cy.contains('button', 'PUBLICATIONS').click()
    cy.contains(professorPubTitle)

    // Delete the publication
    cy.contains('button', 'delete').click()
    cy.on('window:confirm', () => { return true; });
    cy.contains(professorPubTitle).should('not.exist')
  })
  it('Professor Can\'t choose other people', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.contains('Choose Person').should('not.exist')
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
    cy.contains('Choose Person').get('input').eq(0).type(Cypress.env('nonChairUserName'))
    cy.get('.searchDropdownItem').eq(0).click()
    // Check grants
    cy.contains(professsorGrantTitle)

    // Check publications
    cy.contains('div', 'Choose Page').contains('Publications').click()
    cy.contains(professorPubTitle)
  })
})