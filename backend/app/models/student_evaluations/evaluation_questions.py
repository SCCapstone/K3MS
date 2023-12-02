from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class EvaluationQuestions(db.Model):
    question_id: int = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    question_text: str = db.Column(db.String(500), nullable=False)

# Questions:
# 0: The instructor clearly stated the instructional objectives of the course 
# 1: The instructor clearly stated the method by which your final grade would be determined
# 2: The instructor clearly explained any special requirements of attendance which differ from the attendance policy of the University
# 3: The instructor clearly graded and returned the student's written work (e.g.  examinations and papers) in a timely manner
# 4: The instructor met the class regularly and at the scheduled times
# 5: The instructor scheduled a reasonable number of office hours per week
# 6: Please indicate your satisfaction with the availability of the instructor outside the classroom.
# 7: If web sites  Blackboard  or other Internet resources were a part of this course  to what extent did they enhance or detract from your learning experience in the course
# 8: How satisfied were you with the opportunities to interact with other students in the class?
# 9: How satisfied were you with the opportunities to interact with the professor in this course?
# 10: How satisfied were you with the promptness of the feedback that you received in this course?
# 11: How satisfied were you with the technology support required in this course?
# 12: How satisfied were you with the opportunities to access library resources and library support services for this course?
# 13: The stated course objectives reflect what was actually taught
# 14: The assignments were meaningful  and contributed to my understanding of the subject
# 15: The course was intellectually challenging
# 16: The course was well organized
# 17: The required course readings were valuable
# 18: The tests  projects  reports  and/or presentations were related to course objectives
# 19: The assessments used to determine the grade in this course were objectively or fairly scored by the instructor or TA
# 20: Overall  how would you rate this course?
# 21: The instructor made the objectives clear for each class
# 22: The instructor was prepared for each class session
# 23: The instructor made effective use of the available time
# 24: The instructor was enthusiastic about the subject
# 25: The instructor illustrated basic concepts so that I could understand
# 26: The instructor clearly answered questions asked by students
# 27: The instructor respected the students as individuals
# 28: Overall  I rate the performance of my instructor as
# 29: What is your major