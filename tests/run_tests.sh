# Run Behavioral Test on login functionality


# Run Behavioral Tests
cd behavioral_tests && npm ci
npx cypress run --spec "cypress/e2e/test-login.cy.js"
npx cypress run --spec "cypress/e2e/test-user-admin.cy.js"
npx cypress run --spec "cypress/e2e/test-parse-student-evals.cy.js"

# Run Unit Tests
cd ../unit_tests && npm ci
npx cypress run --spec "cypress/e2e/test-get-grants-route.cy.js"
npx cypress run --spec "cypress/e2e/test-create-and-delete-user.cy.js"
# do this last bc it changes password
npx cypress run --spec "cypress/e2e/test-update-password-route.cy.js"