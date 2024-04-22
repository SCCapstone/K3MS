// Test if page opens only for chairs
// Test if page has all expected num of users
// Test if expands to details
// Test if redirects to course analytics page and prepopulates
describe('Test Team Assessments Page - Professor', () => { 
    it('Non-Chairs don\'t have access', () => {

        // Log In as PROFESSOR
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.wait(100)
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('nonChairUserEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('nonChairUserPassword'))
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/dashboard') // make sure logged in

        // Check professor can't see, only chair can
        cy.contains('Team Assessments').should('not.exist')

        cy.visit(Cypress.env('baseUrl') + '/team-assessments')
        cy.contains('Dashboard') // make sure redirected
    })
})
describe('Test Team Assessments Page - Chair', () => { 
    beforeEach(() => {
        // Log In as CHAIR
        cy.visit(Cypress.env('baseUrl') + '/login')
        cy.wait(100)
        cy.contains('section', 'Log In').find('input').first()
        .type(Cypress.env('testEmail'))
        cy.contains('section', 'Log In').find('input').last()
        .type(Cypress.env('testPassword'))
        cy.contains('button', 'Log in').click()
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
        cy.contains('Quincy Quizzes').parent().parent().contains('Course Analytics').click();
        cy.url().should('include','/course-analytics')

        // Check that the page is prepopulated with this members data
        cy.contains('Quincy Quizzes')        
    })
    it('Redirects through a button to a preselected Research Info page for the member', () => {
        
        // Go to team page
        cy.contains('Team Assessments').click()
        
        // Check functionality of 'View Details' button, and what it shows (position)
        cy.contains('Quincy Quizzes').parent().parent().contains('Research Info').click();
        cy.url().should('include','/research-info')

        // Check that the page is prepopulated with this members data
        cy.contains('Quincy Quizzes')
        
        // The rest of course analytics test are done in a separate test
        // This is just to prove that the page gets preselected for this team member
    })
    it('Redirects through a button to a preselected Student Evaluations page for the member', () => {
        
        // Go to team page
        cy.contains('Team Assessments').click()
        
        // Check functionality of 'View Details' button, and what it shows (position)
        cy.contains('Quincy Quizzes').parent().parent().contains('Student Evaluations').click();
        cy.url().should('include','/student-evals')

        // Check that the page is prepopulated with this members data
        cy.contains('Quincy Quizzes')
        
        // The rest of course analytics test are done in a separate test
        // This is just to prove that the page gets preselected for this team member
    })
    it ('Can Filter by User', () => {
        // Go to team page
        cy.contains('Team Assessments').click()

        // Check that the filter works
        cy.contains('Filter Users').get('input').first().type('Quincy Quizzes')
        cy.contains('Quincy Quizzes')
        cy.contains('Timothy Tests').should('not.exist')
    })
    it ('Can Filter by Course', () => {
        // Go to team page
        cy.contains('Team Assessments').click()

        // Check that the filter works
        cy.contains('Has Taught Course').get('input').eq(1).type('CSCE240')
        cy.get('.searchDropdownItem').eq(1).click()
        cy.contains('Quincy Quizzes')
        cy.contains('Preston Presents')
        cy.contains('Timothy Tests').should('not.exist')
    })
})