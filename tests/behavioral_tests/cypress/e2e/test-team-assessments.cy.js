// Test if page opens only for chairs
// Test if page has all expected num of users
// Test if expands to details
// Test if redirects to course analytics page and prepopulates

describe('Test Team Assessments Page', () => { 
    beforeEach(() => {
        // Log In as CHAIR now
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
        cy.contains('button', 'Log in').click()
    })
    it('Only allows Chairs to access', () => {
        // Log out of pre login test
        cy.contains('Log out').click()

        // Log In as PROFESSOR
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testProfessorEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testProfessorPassword'))
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/dashboard') // make sure logged in

        // Check professor can't see, only chair can
        cy.contains('Team Assessments').should('not.exist')
        cy.contains('Log out').click()

        // Log In as CHAIR now
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/dashboard') // make sure logged in
        cy.contains('Team Assessments')
    })
    it('Shows all the necessary team members on the page', () => {

        // Check Team Assessments exists and go to it
        cy.contains('Team Assessments').click()

        // Check all the expected team members show up
        Cypress.env('membersInTeamAssessmentsPage').forEach((member) => {
            cy.contains(member);
        })
    })
    it('Redirects through a button to a preselected Course Analytics page for the member', () => {
        
        // Go to team page
        cy.contains('Team Assessments').click()
        
        // Check functionality of 'View Details' button, and what it shows (position)
        cy.contains('Quincy Quizzes').parent().find('button').click();
        cy.contains('professor')
        
        // Redirect to Course Analytics via button for card
        cy.contains('Course Analytics').click()
        cy.url().should('include','/course-analytics')

        // Check that the page is prepopulated with this members data
        cy.contains('Quincy Quizzes')
        
        // The rest of course analytics test are done in a separate test
        // This is just to prove that the page gets preselected for this team member
    })
})