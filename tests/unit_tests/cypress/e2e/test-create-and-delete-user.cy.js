describe('Create and Delete Users Test', () => {
  it('Chair can create a user', () => {
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

    // Create a user
    cy.request({
      url: Cypress.env('baseUrl') + '/signup',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        last_name: 'Professor',
        first_name: 'Some',
        position: 'professor',
        email: Cypress.env('TmpTestProfessorEmail'),
        password: Cypress.env('TmpTestProfessorPassword')
      }
    }).then((response) => {
      expect(response.status).to.equal(201)
    })
  })
  
  it('Professor cannot create a user', () => {
    // Log in
    cy.request({
      url: Cypress.env('baseUrl') + '/login',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: Cypress.env('TmpTestProfessorEmail'),
        password: Cypress.env('TmpTestProfessorPassword')
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
    })

    // Create a user
    cy.request({
      url: Cypress.env('baseUrl') + '/signup',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        last_name: 'Professor',
        first_name: 'Some',
        position: 'professor',
        email: 'not-a-real-email@gmail.com',
        password: 'not-a-real-password'
      }
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })
  
  it('Professor cannot delete a user', () => {
    // Log in
    cy.request({
      url: Cypress.env('baseUrl') + '/login',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: Cypress.env('TmpTestProfessorEmail'),
        password: Cypress.env('TmpTestProfessorPassword')
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
    })

    // Delete a user
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_user',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'DELETE',
      body: {
        email: Cypress.env('TmpTestProfessorEmail')
      }
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })

  it('Chair can delete a user', () => {
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

    // Delete a user
    cy.request({
      url: Cypress.env('baseUrl') + '/delete_user',
      followRedirect: false,
      failOnStatusCode: false,
      method: 'DELETE',
      body: {
        email: Cypress.env('TmpTestProfessorEmail'),
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
    })
  })
})