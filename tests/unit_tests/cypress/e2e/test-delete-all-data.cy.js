const deleteEvalsConfirm = 'I want to delete all student evaluations in the database'

describe('Test Delete All Data - Professors', () => {
  beforeEach(() => {
    // Log in
    cy.request({
      url: Cypress.env('baseUrl') + '/login',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: Cypress.env('nonChairUserEmail'),
        password: Cypress.env('nonChairUserPassword')
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
    })
  })
  it('Professor cannot delete eval data', () => {
    // Delete all data
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_evals',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'DELETE',
      body: JSON.stringify({
        confirmText: deleteEvalsConfirm
      })
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })
})

describe('Test Delete All Data - Chair', () => {
  beforeEach(() => {
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
  })
  it('Chair can delete eval data', () => {
    // Delete all data
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_evals',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        confirmText: deleteEvalsConfirm
      })
    }).then((response) => {
      expect(response.status).to.equal(200)
    })

    // Check that all evals are deleted
    cy.request({
      url: Cypress.env('baseUrl') + '/student_evals',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
    cy.request({
      url: Cypress.env('baseUrl') + '/student_evals_details/CSCE240',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
    cy.request({
      url: Cypress.env('baseUrl') + "/student_evals/" + Cypress.env('nonChairUserEmail'),
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
    cy.request({
      url: Cypress.env('baseUrl') + '/student_evals_details/CSCE350/' + Cypress.env('nonChairUserEmail'),
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.equal(404)
    })

  })
})