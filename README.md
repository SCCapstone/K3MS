# App Overview
TODO: Link to wiki pages

# Running the webapp

## Requirements
- must have python3 installed. This project was built in python version `3.11.x`
- must have node.js installed on the system. This project was built in node version `10.1.x`
- run `sudo apt-get install python3-dev default-libmysqlclient-dev build-essential ` to install mysqldb package on Ubunut
    - On Mac, install through homebrew: `brew install mysql` (This might not be correct not 100% sure)

## Setup
- Create the file `backend/.env` and add the line `DATABASE_URI='mysql://username:password@hostname/workout-db'` where "username" and "password" are used to log in to a mysql server being hosted by "hostname".
- Alternatively (for development) do not create this file. This will prompt the app to create a temporary sqlite database file called `app.db`

- Before running this app for the first time, initialize the database tables. Run the following commands
    ```
    cd backend
    python3 -m venv env
    source env/bin/activate
    pip3 install -r requirements.txt
    env/bin/flask shell
    >>> db.create_all()
    ```

## Start the Servers (Individually, for development)
- In the `backend` directory, run `python3 run_debug_server.py` with the environment activated
- In the `frontend/app` directory, run `npm start`

## Start the Servers (Production)
- Run the start script with `./run_app.sh` to start the gunicorn flask server and to serve the static react build

### Stop the Production Server
- To stop the React process, hit `^C` on the shell running `./run_app.py`
- To stop the Flask server, stop the gunicorn process by finding its pid or running the command `pkill gunicorn`.

## TODO:
- The installation and step process will be taken care of in a docker file
