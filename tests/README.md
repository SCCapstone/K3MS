# Testing

## Setup
- Install packages with `npm ci`
    - This needs to done in `tests/behavioral_tests` and `tests/unit_tests`

- Create `cypress.env.json` in `tests/behavioral_tests` and `tests/unit_tests`
    - for `tests/behavioral_tests`, this should include the following fields:
        - `baseUrl`: URL of frontend server
        - `testEmail`: email address of known user to test
        - `testPassword`: password of known user
        - `testIncorrectEmail`: some incorrent email address
        - `testIncorrectPassword` some incorrect password
    - for `tests/unit_tests`, this should include:
        - `baseUrl`: URL of backend server
        - `testEmail`: email address of known user to test
        - `testPassword`: password of known user
        - `testGrantObjects`: list of grant objects that should be returned
    - Example files will be provided

## Run Tests
- Run Tests with GUI: `npx cypress open`
- Run Tests from command line: `./run_tests.sh`
