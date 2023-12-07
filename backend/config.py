from dotenv import load_dotenv
import os
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

# We don't have this yet -- we will set the uri in a .env file once we setup our MySQL database
# This sets up a temporary sqlite database file
uri = os.getenv("DATABASE_URI")
if uri is None:
    uri = "sqlite:///" + os.path.join(basedir, "app.db")

class Config:
    SQLALCHEMY_DATABASE_URI = uri
    SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY")
    # SESSION_COOKIE_SECURE=True,
    # SESSION_COOKIE_SAMESITE = 'Strict'    # This is needed for cross-site cookies
    # SESSION_COOKIE_HTTPONLY = True
