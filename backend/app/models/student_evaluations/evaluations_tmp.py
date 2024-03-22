from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class EvaluationsTmp(db.Model):
    email: str = db.Column(db.String(100), nullable=False, primary_key=True)
    year: str = db.Column(db.String(100), nullable=False, primary_key=True)
    semester: str = db.Column(db.String(100), nullable=False, primary_key=True) # fall, spring, summer
    course: str = db.Column(db.String(100), nullable=False, primary_key=True)
    section: str = db.Column(db.String(100), nullable=False, primary_key=True)
    instructor_type: str = db.Column(db.String(100), nullable=False) # form of address field
    participants_count: int = db.Column(db.Integer, nullable=False)
    number_of_returns: int = db.Column(db.Integer, nullable=False)
    course_rating_mean: float = db.Column(db.Float, nullable=False)
    instructor_rating_mean: float = db.Column(db.Float, nullable=False)

    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)

    def get_attr(self):
        return {
            "email": self.email,
            "year": self.year,
            "semester": self.semester,
            "course": self.course,
            "section": self.section,
            "instructor_type": self.instructor_type,
            "participants_count": self.participants_count,
            "number_of_returns": self.number_of_returns,
            "course_rating_mean": self.course_rating_mean,
            "instructor_rating_mean": self.instructor_rating_mean,
            "date_added": self.date_added,
        }