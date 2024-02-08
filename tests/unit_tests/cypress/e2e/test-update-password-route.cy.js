import _ from 'lodash'

describe('Update Password Route Test', () => {
    // No Access to Update Password When Not Logged In
    it('If Logged Out No Access To Update Password', () => {
        cy.request({
            url: Cypress.env('baseUrl') + '/update_password',
            followRedirect: false,
            failOnStatusCode: false,
            method: 'POST',
            body: {
                new_password: Cypress.env('testPassword'),
                confirm_new_password: Cypress.env('testNewPassword')
            }
            }).then((response) => {
            expect(response.status).to.equal(401)
            })
      })

    // Can Access But Not Utilize Update Password When Logged In (Passwords Do Not Match pt. 1)
    it('If Logged In Access To But Cannot Utilize Update Password - Passwords Do Not Match pt. 1', () => {
        // Log In
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

        // Access Update Password But Cannot Update Password When new_password and confirm_new_password Do Not Match
        cy.request({
            url: Cypress.env('baseUrl') + '/update_password',
            followRedirect: false,
            failOnStatusCode: false,
            method: 'POST',
            body: {
                new_password: Cypress.env('testPassword'),
                confirm_new_password: Cypress.env('testNewPassword')
            }
            }).then((response) => {
            expect(response.status).to.equal(400)
            })
    })

    // Can Access But Not Utilize Update Password When Logged In (Passwords Do Not Match pt. 2)
    it('If Logged In Access To But Cannot Utilize Update Password - Passwords Do Not Match pt. 2', () => {
        // Log In
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

        // Access Update Password But Cannot Update Password When new_password and confirm_new_password Do Not Match
        cy.request({
            url: Cypress.env('baseUrl') + '/update_password',
            followRedirect: false,
            failOnStatusCode: false,
            method: 'POST',
            body: {
                new_password: Cypress.env('testNewPassword'),
                confirm_new_password: Cypress.env('testPassword')
            }
            }).then((response) => {
            expect(response.status).to.equal(400)
            })
    })

    // Can Access And Utilize Update Password When Logged In (Passwords Match)
    it('If Logged In Access and Utilize Update Password', () => {
        // Log In
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

        // Access Update Password And Update Password When new_password and confirm_new_password match
        cy.request({
            url: Cypress.env('baseUrl') + '/update_password',
            followRedirect: false,
            failOnStatusCode: false,
            method: 'POST',
            body: {
                new_password: Cypress.env('testNewPassword'),
                confirm_new_password: Cypress.env('testNewPassword')
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            })
    })

    // Cannot Login With Old Password
    it('Cannot Login With Old Password', () => {
        // Log In
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
            expect(response.status).to.equal(400)
        })
    })
    
    // Can Login With New Password
    it('Can Login With Old Password', () => {
        // Log In
        cy.request({
            url: Cypress.env('baseUrl') + '/login',
            followRedirect: false,
            failOnStatusCode: false,
            method: 'POST',
            body: {
            email: Cypress.env('testEmail'),
            password: Cypress.env('testNewPassword')
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
        })
    })


})