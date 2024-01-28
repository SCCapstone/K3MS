describe('Grants Route Test', () => {
  it('If Logged Out Return No Grants', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Log In') // is not logged in
    cy.request({
      url: Cypress.env('grantsUrl'),
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401)
    })

  })

  it('If Logged In Only Return Grants Belonging To User', () => {
    // Log in
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('section', 'Log In').find('input').first()
      .type(Cypress.env('testEmail'))
    cy.contains('section', 'Log In').find('input').last()
      .type(Cypress.env('testPassword'))
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/dashboard') // make sure logged in

    // Verify Access to Grants Backend
    var data = 0
    cy.request({
      url: Cypress.env('grantsUrl'),
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200)
      if (response.ok) {
        const data = response.json()
      }
    })

    console.log("Printing Output")
    cy.expect(data.email).to.equal()
    for (var index in data) {
      cy.expect(data[index].email === Cypress.env('testEmail'))
    }


    
  })






})