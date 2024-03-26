from app.extensions import db
from dataclasses import dataclass

@dataclass
class Profile(db.Model):
    email: str = db.Column(db.String(64), nullable=False, primary_key=True) # todo verify email
    first_name: str = db.Column(db.String(64), nullable=False)
    last_name: str = db.Column(db.String(64), nullable=False)
    # Add column for profile picture as a varbinary
    profile_picture: bytes = db.Column(db.LargeBinary, nullable=True)
