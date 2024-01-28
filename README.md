# App Overview

Our [Wiki](https://github.com/SCCapstone/K3MS/wiki) provides an overview of our project.
- [Description](https://github.com/SCCapstone/K3MS/wiki/Project-Description)
- [Design](https://github.com/SCCapstone/K3MS/wiki/Design)
- [Requirements](https://github.com/SCCapstone/K3MS/wiki/Requirements)
- [Architecture](https://github.com/SCCapstone/K3MS/wiki/Architecture)

# Running the webapp

## Requirements
- must have python3 installed. This project was built in python version `3.11.x`
- must have node.js installed on the system. This project was built in node version `20.10.x` (npm version `10.2.x`)
- if on Ubuntu:
    - run `sudo apt-get install python3-dev default-libmysqlclient-dev build-essential ` to install mysqldb package
    - run `sudo apt-get install -y pkg-config ` to install pkg-config package
- if on Mac
    - install through homebrew: `brew install mysql`

## Setup
- Create the file `backend/.env` and add the following:
    - `DATABASE_URI='mysql://username:password@hostname/k3ms-db'` where "username" and "password" are used to log in to a mysql server being hosted by "hostname".
        - Alternatively (for development) do not add this. This will prompt the app to create a temporary sqlite database file called `app.db`
    - `SESSION_SECRET_KEY=<Some Secret Key>`
        - If you do not have one, you can generate a secret key with: `python3 -c "import secrets; print(secrets.token_hex(32))"`
- Create the file `frontend/app/.env` and add `REACT_APP_BASE_URL=<URL of backend server>` (eg. http://localhost:8000 if running locally)

- Before running this app for the first time, run the following commands to set up the environments:
    ```
    cd backend
    python3 -m venv env
    source env/bin/activate
    pip3 install -r requirements.txt

    cd frontend/app
    npm ci
    ```
- If running a local database (rather than connected to the online shared database), run the following commands to initialize it:
    ```
    env/bin/flask shell
    >>> db.create_all()
    >>> exit()
    env/bin/flask db stamp head
    ```

## Start the Servers (Individually, for development)
- In the `backend` directory, run `python3 run_debug_server.py` with the environment activated
- In the `frontend/app` directory, run `npm start`

## Start the Servers (Production)
- Run the start script with `./run_app.sh` to start the gunicorn flask server and to serve the static react build.

### Stop the Production Server
- To stop the React process, hit `^C` on the shell running `./run_app.py`.
- To stop the Flask server, stop the gunicorn process by finding its pid or running the command `pkill gunicorn`.

## TODO:
- Installation & setup process will be taken care of in a docker file.


# Testing
- Unit and Behavorial tests are implemented with Cypress
- Behavorial tests are in the `tests/behavioral_tests` directory
- Unit tests are in the `tests/unit_tests` directory