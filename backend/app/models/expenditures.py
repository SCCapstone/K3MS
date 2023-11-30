from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Expenditures(db.Model):
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    calendar_year: str = db.Column(db.String(100), nullable=False)
	reporting_department: str = db.Column(db.String(100), nullable=False)
	pi_name: str = db.Column(db.String(100), nullable=False)
	amount: int = db.Column(db.Integer, nullable=False)
	date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
