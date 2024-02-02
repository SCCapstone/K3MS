import _ from 'lodash'

describe('Grants Route Test', () => {
  it('If Logged Out Return No Grants', () => {
    cy.request({
      url: Cypress.env('baseUrl') + 'grants',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })

  it('If Logged In Return the Expected Grants for User and Only Those', () => {
    // Log in
    cy.request({
      url: Cypress.env('baseUrl') + 'login',
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
      url: Cypress.env('baseUrl') + 'grants',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.length(Cypress.env('testGrantObjects').length)
      response.body.forEach((grant) => {
        let foundMatch = false
        Cypress.env('testGrantObjects').forEach((testGrant) => {
          if (_.isEqual(grant, testGrant)) {
            foundMatch = true
          }
        })
        expect(foundMatch).to.be.true
      })
    })
  })
})