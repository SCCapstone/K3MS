const professsorGrantTitle = 'Research Info Delete Test Grant Professor'
const professsorGrantTitle2 = 'Research Info Delete Test Grant 2'
const professorPubTitle = 'Research Info Delete Test Publication Professor'
const professorExpenYear = '1990'
const chairGrantTitle = 'Research Info Delete Test Grant Chair'
const chairPubTitle = 'Research Info Delete Test Publication Chair'
const chairExpenYear = '1991'

describe('Research Info Delete Test: Professor', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('loginUrl'))
    cy.wait(100)
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('nonChairUserEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('nonChairUserPassword'))
    cy.contains('button', 'Log in').click()
    cy.url().should('include', '/dashboard') // make sure logged in
  })
  it("Professor Can Add a Grant", () => {
    cy.visit(Cypress.env('baseUrl') + '/grantupload')
    cy.wait(100)
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type(professsorGrantTitle)
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')      
    cy.contains('section', 'Grant Information').find('button').first().click()

    // add a second grant for later testing
    cy.visit(Cypress.env('baseUrl') + '/grantupload')
    cy.wait(100)
    cy.contains('section', 'Grant Information').find('input')
      .eq(0).type(professsorGrantTitle2)
    cy.contains('section', 'Grant Information').find('input')
      .eq(1).type('10000')
    cy.contains('section', 'Grant Information').find('input')
      .eq(2).type('2023')      
    cy.contains('section', 'Grant Information').find('button').first().click()

    // Check that redirected to research-info
    cy.url().should('include', '/research-info')

    // Check that grant is there
    cy.contains(professsorGrantTitle)

  })
  it("Professor Can delete a grant", () => {
    // Delete the grant
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('div', 'Choose Page').contains('Grants').click()
    cy.contains('li', professsorGrantTitle).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(professsorGrantTitle).should('not.exist')
  })
  it("Professor Can Add a Publication", () => {
    // Visit pub info site
    cy.visit(Cypress.env('baseUrl') + '/pubupload')
    cy.wait(100)
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
    cy.contains(professorPubTitle)
  })
  it("Professor Can delete a publication", () => {
    // Delete the publication
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('div', 'Choose Page').contains('Publications').click()
    cy.contains('li', professorPubTitle).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(professorPubTitle).should('not.exist')
  })
  it("Professor Can Add an Expenditure", () => {
    // Visit expen add form
    cy.visit(Cypress.env('baseUrl') + '/expenupload')
    cy.wait(100)
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
  it("Professor Can delete an expenditure", () => {
    // Delete the expenditure
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('div', 'Choose Page').contains('Expenditures').click()
    cy.contains('tr', professorExpenYear).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(professorExpenYear).should('not.exist')
  })
  it('Professor Can\'t delete data for other people', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('Choose Person').should('not.exist')
  })
})

describe('Research Info Delete Test: Chair', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('loginUrl'))
    cy.wait(100)
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()
    cy.url().should('include', '/dashboard') // make sure logged in
  })
  it("Chair Can Add a Grant", () => {
    cy.visit(Cypress.env('baseUrl') + '/grantupload')
    cy.wait(100)
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
  it("Chair Can delete a grant", () => {
    // Delete the grant
    cy.wait(100)
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.contains('div', 'Choose Page').contains('Grants').click()
    cy.contains('li', chairGrantTitle).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(chairGrantTitle).should('not.exist')
  })
  it("Chair Can Add a Publication", () => {
    // Visit pub info site
    cy.visit(Cypress.env('baseUrl') + '/pubupload')
    cy.wait(100)
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
  it("Chair Can delete a publication", () => {
    // Delete the publication
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('div', 'Choose Page').contains('Publications').click()
    cy.contains('li', chairPubTitle).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(chairPubTitle).should('not.exist')
  })
  it("Chair Can Add an Expenditure", () => {
    // Visit expen add form
    cy.visit(Cypress.env('baseUrl') + '/expenupload')
    cy.wait(100)
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
  it("Chair Can delete an expenditure", () => {
    // Delete the expenditure
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('div', 'Choose Page').contains('Expenditures').click()
    cy.contains('tr', chairExpenYear).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(chairExpenYear).should('not.exist')
  })
  it('Chair can choose other people and see their info', () => {
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(500)
    cy.contains('Choose Person').get('input').eq(0).type(Cypress.env('nonChairUserName'))
    cy.get('.searchDropdownItem').eq(0).click()
    // Check grants
    cy.contains(professsorGrantTitle2)
  })
  it('Chair can choose other people and delete their info', () => {
    // Delete the grant
    cy.visit(Cypress.env('baseUrl') + '/research-info')
    cy.wait(100)
    cy.contains('Choose Person').get('input').eq(0).type(Cypress.env('nonChairUserName'))
    cy.get('.searchDropdownItem').eq(0).click()
    cy.contains('li', professsorGrantTitle2).find('button').click()
    cy.contains('div', 'Confirm').find('button').eq(0).click()
    cy.contains(professsorGrantTitle2).should('not.exist')
  })
})
