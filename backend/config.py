from dotenv import load_dotenv
import os
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

# We don't have this yet -- we will set the uri in a .env file once we setup our MySQL database
# This sets up a temporary sqlite database file
uri = os.getenv("DATABASE_URI")
if uri is None:
    uri = "sqlite:///" + os.path.join(basedir, "app.db")

class Config:
    SQLALCHEMY_DATABASE_URI = uri
    SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY")
    # SESSION_COOKIE_SECURE=True,
    # SESSION_COOKIE_SAMESITE = 'Strict'    # This is needed for cross-site cookies
    # SESSION_COOKIE_HTTPONLY = True

    ALLOWED_EVAL_EXTENSIONS = ['xlsx']
    # These strings are exactly as they appear in the excel sheet - dont modify them
    QUESTIONS = {
        1: "the instructor clearly stated the instructional objectives of the course.",
        2: "the instructor clearly stated the method by which your final grade would be determined.",
        3: "the instructor clearly explained any special requirements of attendance which differ from the attendance policy of the university.",
        4: "the instructor clearly graded and returned the student's written work (e.g.  examinations and papers) in a timely manner.",
        5: "the instructor met the class regularly and at the scheduled times.",
        6: "the instructor scheduled a reasonable number of office hours per week.",
        7: "please indicate your satisfaction with the availability of the instructor outside the classroom. (in selecting your rating  consider the instructor&#39;s availability via established office hours  appointments  and other opportunities for face-to-face interaction as well as via telephone  e-mail  fax and other means).",
        8: "if web sites  blackboard  or other internet resources were a part of this course  to what extent did they enhance or detract from your learning experience in the course.",
        9: "how satisfied were you with the opportunities to interact with other students in the class?",
        10: "how satisfied were you with the opportunities to interact with the professor in this course?",
        11: "how satisfied were you with the promptness of the feedback that you received in this course?",
        12: "how satisfied were you with the technology support required in thiscourse?",
        13: "how satisfied were you with the opportunities to access library resources and library support services for this course?",
        14: "the stated course objectives reflect what was actually taught.",
        15: "the assignments were meaningful  and contributed to my understanding of the subject.",
        16: "the course was intellectually challenging.",
        17: "the course was well organized.",
        18: "the required course readings were valuable.",
        19: "the tests  projects  reports  and/or presentations were related to course objectives.",
        20: "the assessments used to determine the grade in this course were objectively or fairly scored by the instructor or ta.",
        21: "overall  how would you rate this course?",
        22: "the instructor made the objectives clear for each class.",
        23: "the instructor was prepared for each class session.",
        24: "the instructor made effective use of the available time.",
        25: "the instructor was enthusiastic about the subject.",
        26: "the instructor illustrated basic concepts so that i could understand.",
        27: "the instructor clearly answered questions asked by students.",
        28: "the instructor respected the students as individuals.",
        29: "overall  i rate the performance of my instructor as:",
        30: "what is your major:"
    }