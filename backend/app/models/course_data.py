from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class CourseData(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
