import _ from 'lodash'

describe('Test Student Eval Details Route', () => {
  it('If Logged Out Return No Student Evals', () => {
    cy.request({
      url: Cypress.env('baseUrl') + '/student_evals_details/CSCE240',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })

  it('If Logged In Return the Expected Student Eval Details', () => {
    // Log in
    cy.request({
      url: Cypress.env('baseUrl') + '/login',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: Cypress.env('testEmail'),
        password: Cypress.env('testPassword')
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
    })

    cy.request({
      url: Cypress.env('baseUrl') +  '/student_evals_details/CSCE240',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.length(1) // only one section taught for this user
      expect(response.body[0].course).to.equal('CSCE240')
      expect(response.body[0].course_rating_mean).to.equal(4.89)
      expect(response.body[0].details).to.have.length(30)
    })
  })
})
