from . import db

class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    sub1 = db.Column(db.String(200), nullable=True)
    sub2 = db.Column(db.String(200), nullable=True)
    sub3 = db.Column(db.String(200), nullable=True)
    sub1_complted = db.Column(db.Boolean, nullable=True)
    sub2_complted = db.Column(db.Boolean, nullable=True)
    sub3_complted = db.Column(db.Boolean, nullable=True)

print('db created')