# Testing

## Setup
- Install packages with `npm ci`
    - This needs to done in `tests/behavioral_tests` and `tests/unit_tests`

- Create `cypress.env.json` in `tests/behavioral_tests` and `tests/unit_tests`
    - See `test/behavioral_tests/cypress.env.json.example` and `test/unit_tests/cypress.env.json.example` to see example environment files
    - These files can be copied to use as environment files with the provided database

- Get a test Sqlite database (app.db)
    - Download app.db from google drive which has the necessary users for testing. Move the `app.db` file to `backend`

- Test-specific instructions:
    - for `test-parse-student-evals` test:
        - download the student evals excel sheet (`test-student-eval-sample.xlsx`) from google drive and put it in the `tests/behavioral_tests/cypress/fixtures` directory

## Run Tests
- Remove or comment out the DATABASE_URI entry in backend/.env
- Set the `REACT_APP_BASE_URL` entry in `frontend/app/.env` to point to the local backend process (eg. http://localhost:8000)
- Run Tests with GUI: `npx cypress open`
- Run Tests from command line: `./run_tests.sh`
