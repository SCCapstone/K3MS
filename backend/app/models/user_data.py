from app.extensions import db
from dataclasses import dataclass
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

@dataclass
class UserData(db.Model, UserMixin):
    username: str = db.Column(db.String(50), primary_key=True)
    email: str = db.Column(db.String(50), nullable=False, unique=True) # todo verify email
    first_name: str = db.Column(db.String(50), nullable=False)
    last_name: str = db.Column(db.String(50), nullable=False)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
    password_hash = db.Column(db.String(2000))
  
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
  
    @password.setter
    def password(self, password):
        # Set password_hash with hashed value of password
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User: Name: {self.last_name}, {self.first_name} - Email: {self.email}>'
