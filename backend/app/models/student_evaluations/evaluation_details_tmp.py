from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class EvaluationDetailsTmp(db.Model):
    # Primary keys
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    year: str = db.Column(db.String(100), nullable=False, primary_key=True)
    semester: str = db.Column(db.String(100), nullable=False, primary_key=True)
    course: str = db.Column(db.String(100), nullable=False, primary_key=True)
    question_id: int = db.Column(db.Integer, nullable=False, primary_key=True)
    section: str = db.Column(db.String(100), nullable=False, primary_key=True)

    # Stats for each question
    mean: float = db.Column(db.Float, nullable=False)
    std: float = db.Column(db.Float, nullable=False)
    median: float = db.Column(db.Float, nullable=False)
    returns: int = db.Column(db.Integer, nullable=False)

    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)