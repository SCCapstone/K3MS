const deleteEvalsConfirm = 'I want to delete all student evaluations in the database'
const grantsConfirmationText = "I want to delete all my grants"
const pubsConfirmationText = "I want to delete all my publications"
const expensConfirmationText = "I want to delete all my expenditures"

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
      headers: {'Content-Type': 'application/json'},
      method: 'DELETE',
      body: JSON.stringify({
        confirmText: deleteEvalsConfirm
      })
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })
  it('Professor can delete grants', () => {
    // Create a grant
    cy.request({
      url: Cypress.env('baseUrl') + '/grantupload',
      followRedirect: false,
      failOnStatusCode: false,
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
        title: 'Delete All Data Test Grant',
        amount: 1000,
        year: 2021
      })
    }).then((response) => {
      expect(response.status).to.equal(201)
    })

    cy.wait(100)
    // Delete all data
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_all_my_grants',
      followRedirect: false,
      failOnStatusCode: false,
      headers: {'Content-Type': 'application/json'},
      method: 'DELETE',
      body: JSON.stringify({
        confirmText: grantsConfirmationText
      })
    }).then((response) => {
      expect(response.status).to.equal(200)
    })
    cy.wait(100)
    // Expect to get no grants
    cy.request({
      url: Cypress.env('baseUrl') + '/grants',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET'
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
  })
  it('Professor can delete publications', () => {
    // Create a publication
    cy.request({
      url: Cypress.env('baseUrl') + '/pubupload',
      followRedirect: false,
      failOnStatusCode: false,
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
        title: 'Delete All Data Test Publication',
        authors: 'Test Author',
        publication_year: 2021
      })
    }).then((response) => {
      expect(response.status).to.equal(201)
    })
    cy.wait(100)
    // Delete all data
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_all_my_pubs',
      followRedirect: false,
      failOnStatusCode: false,
      headers: {'Content-Type': 'application/json'},
      method: 'DELETE',
      body: JSON.stringify({
        confirmText: pubsConfirmationText
      })
    }).then((response) => {
      expect(response.status).to.equal(200)
    })
    cy.wait(100)
    // Expect to get no publications
    cy.request({
      url: Cypress.env('baseUrl') + '/publications',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET'
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
  })

  it('Professor can delete expenditures', () => {
    // Create an expenditure
    cy.request({
      url: Cypress.env('baseUrl') + '/expenupload',
      followRedirect: false,
      failOnStatusCode: false,
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
        amount: 1000,
        year: 2021,
        reporting_department: 'Test Department',
        pi_name: 'Test PI'
      })
    }).then((response) => {
      expect(response.status).to.equal(201)
    })
    cy.wait(100)
    // Delete all data
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_all_my_expens',
      followRedirect: false,
      failOnStatusCode: false,
      headers: {'Content-Type': 'application/json'},
      method: 'DELETE',
      body: JSON.stringify({
        confirmText: expensConfirmationText
      })
    }).then((response) => {
      expect(response.status).to.equal(200)
    })
    cy.wait(100)
    // Expect to get no expenditures
    cy.request({
      url: Cypress.env('baseUrl') + '/expenditures',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'GET'
    }).then((response) => {
      expect(response.status).to.equal(404)
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