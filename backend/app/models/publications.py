from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Publications(db.Model):
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    first_name: str = db.Column(db.String(100), nullable=False)
	last_name: str = db.Column(db.String(100), nullable=False)
	title: str = db.Column(db.String(500), nullable=False, primary_key=True)
	publication_year: str = db.Column(db.String(100), nullable=False)
	isbn: str = db.Column(db.String(100), nullable=False)
	date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
