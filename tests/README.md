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
        - `testIncorrectPassword`: some incorrect password
        - `studentEvalSampleFN`: name of student evaluations excel sheet in fixtures
        - `coursesInStudentEvalSampleForTestUser`: list of courses that will be uploaded by the excel sheet for testEmail user
    - for `tests/unit_tests`, this should include:
        - `baseUrl`: URL of backend server
        - `testEmail`: email address of known user to test
        - `testPassword`: password of known user
        - `testNewPassword`: new password for known user
        - `testGrantObjects`: list of grant objects that should be returned
    - Example files will be provided

- Get a test Sqlite database (app.db)
    - Remove or comment out the DATABASE_URI entry in backend/.env
    - Download app.db from google drive which has the necessary users for testing

- Test-specific instructions:
    - for `test-parse-student-evals` test:
        - download the student evals excel sheet from google drive and put it in the `tests/behavioral_tests/cypress/fixtures` directory
        - make sure that there are no Student Evaluation entries in the database for test user before running this test

## Run Tests
- Run Tests with GUI: `npx cypress open`
- Run Tests from command line: `./run_tests.sh`
