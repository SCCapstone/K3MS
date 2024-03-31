from app.extensions import db
from dataclasses import dataclass
from flask_login import UserMixin
from datetime import datetime

@dataclass
class UserTmp(db.Model, UserMixin):
    email: str = db.Column(db.String(64), nullable=False, primary_key=True) # todo verify email
    first_name: str = db.Column(db.String(64), nullable=False)
    last_name: str = db.Column(db.String(64), nullable=False)
    position: str = db.Column(db.String(64), nullable=False)    # ie. chair, professor, instructor
    link_hash: str = db.Column(db.String(2000), nullable=False)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_attr(self):
        return {
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'position': self.position,
            'date_added': self.date_added,
        }
    
    # Override UserMixin function to return email when loading user
    def get_id(self):
        return str(self.email)
    
    def __repr__(self):
        return f'<User: Name: {self.last_name}, {self.first_name} - Email: {self.email}>'
