from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/tasks.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    db.init_app(app)

    

    with app.app_context():
        from .models import Task
        db.create_all()
        db.session.commit()
        from app.controllers.tasks import tasks_blueprint
        app.register_blueprint(tasks_blueprint)

    return app