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

    def get_attr(self):
        return {
            "email": self.email,
            "year": self.year,
            "semester": self.semester,
            "course": self.course,
            "question_id": self.question_id,
            "section": self.section,
            "mean": self.mean,
            "std": self.std,
            "median": self.median,
            "returns": self.returns,
        }