# Run Behavioral Test on login functionality

# Run Behavioral Tests
cd behavioral_tests && npm ci
npx cypress run --spec "cypress/e2e/sequenced-all-tests.cy.js"

# Run Unit Tests
cd ../unit_tests && npm ci
npx cypress run --spec "cypress/e2e/sequenced-all-tests.cy.js"