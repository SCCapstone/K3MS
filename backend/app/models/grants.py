from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Grants(db.Model):
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    title: str = db.Column(db.String(500), nullable=False)
	amount: int = db.Column(db.Integer, nullable=False)
	date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
