from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Publications(db.Model):
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    title: str = db.Column(db.String(500), nullable=False, primary_key=True)
    authors: str = db.Column(db.String(5000), nullable=False)
    publication_year: str = db.Column(db.String(100), nullable=False)
    isbn: str = db.Column(db.String(100), nullable=True)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
