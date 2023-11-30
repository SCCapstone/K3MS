from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Evaluations(db.Model):
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    year: str = db.Column(db.String(100), nullable=False, primary_key=True)
    semester: str = db.Column(db.String(100), nullable=False, primary_key=True)
    instructor_type: str = db.Column(db.String(100), nullable=False)
    course: str = db.Column(db.String(100), nullable=False)
    participants_count: int = db.Column(db.Integer, nullable=False)
    number_of_returns: int = db.Column(db.Integer, nullable=False)
    stated_objective_mean: float = db.Column(db.Float, nullable=False)
    stated_objective_std_deviation: float = db.Column(db.Float, nullable=False)
    stated_objective_median: float = db.Column(db.Float, nullable=False)
    stated_objective_returns: float = db.Column(db.Float, nullable=False)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)
