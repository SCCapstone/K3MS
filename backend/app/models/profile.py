from app.extensions import db
from dataclasses import dataclass

@dataclass
class Profile(db.Model):
    email: str = db.Column(db.String(64), nullable=False, primary_key=True) # todo verify email
    first_name: str = db.Column(db.String(64), nullable=False)
    last_name: str = db.Column(db.String(64), nullable=False)
    # Add column for profile picture as long blob
    profile_picture: bytes = db.Column(db.LargeBinary(length=(2**32)-1), nullable=True)
    file_type: str = db.Column(db.String(64), nullable=True)
