from app.extensions import db
from dataclasses import dataclass
from flask_login import UserMixin
from datetime import datetime

@dataclass
class ResetPasswordTmp(db.Model, UserMixin):
    email: str = db.Column(db.String(64), nullable=False, primary_key=True) # todo verify email
    link_hash: str = db.Column(db.String(2000), nullable=False)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)