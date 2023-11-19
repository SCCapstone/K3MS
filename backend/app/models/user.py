from app.extensions import db
from dataclasses import dataclass
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

@dataclass
class User(db.Model, UserMixin):
    email: str = db.Column(db.String(64), nullable=False, primary_key=True) # todo verify email
    first_name: str = db.Column(db.String(64), nullable=False)
    last_name: str = db.Column(db.String(64), nullable=False)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
    password_hash = db.Column(db.String(2000))
    
    # Override UserMixin function to return email when loading user
    def get_id(self):
        return str(self.email)
    
    def __repr__(self):
        return f'<User: Name: {self.last_name}, {self.first_name} - Email: {self.email}>'
