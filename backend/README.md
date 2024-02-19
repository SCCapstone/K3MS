# Some Instructions and Info about Backend

- Starting the backend server is covered in the top-level [README.md](/README.md)

## Database Migration
- Implemented with [Flask Migrate](https://flask-migrate.readthedocs.io/en/latest/)
- Whenever a change is made to one of the database models, must migrate database to keep it up to date and keep a version history of database versions
- Here's how to migrate the database:
    - Run `env/bin/flask db migrate -m "message"`. This step will create a script in `backend/migrations/versions/<tag>_<message>.py`. Review this script to make sure the changes you want will occur
    - Run `env/bin/flask db upgrade`. This step will create/delete/modify the tables in the actual database.

# TEST 
