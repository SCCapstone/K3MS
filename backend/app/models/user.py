from app.extensions import db
from dataclasses import dataclass
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

@dataclass
class User(db.Model, UserMixin):
    email: str = db.Column(db.String(64), nullable=False, primary_key=True) # todo verify email
    id: int = db.Column(db.Integer, unique=True, autoincrement=True)
    first_name: str = db.Column(db.String(64), nullable=False)
    last_name: str = db.Column(db.String(64), nullable=False)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
    password_hash = db.Column(db.String(2000))
    
    # Login functions
    def is_authenticated(self):
        return True
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
    def get_id(self):
        return str(self.id)


    def get_id(self):
        return self.username

    def __repr__(self):
        return f'<User: Name: {self.last_name}, {self.first_name} - Email: {self.email}>'
