from flask import request, jsonify, Blueprint
from app import db
from app.models import Task
from openai import OpenAI

tasks_blueprint = Blueprint('tasks', __name__)

client = OpenAI(
    api_key="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",
)

@tasks_blueprint.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        tasks = Task.query.all()
        return jsonify([{'id': task.id, 'title': task.title, 'description': task.description, 'completed': task.completed, 'sub1': task.sub1, 'sub2': task.sub2, 'sub3': task.sub3} for task in tasks]), 200
    elif request.method == 'POST':
        
        data = request.get_json()
        print(data)
        new_task = Task(
            title=data.get('title', ''),
            description=data.get('description', ''),
            completed=data.get('completed', False),
            sub1=data.get('sub1', ''),
            sub2=data.get('sub2', ''),
            sub3=data.get('sub3', '')
        )
        
        db.session.add(new_task)
        db.session.commit()

        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'completed': new_task.completed,
            'sub1': new_task.sub1,
            'sub2': new_task.sub2,
            'sub3': new_task.sub3
        }), 201

@tasks_blueprint.route("/generate_subtasks", methods=["POST"])
def generate_subtasks():
    data = request.get_json()
    task_title = data.get("title")

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": f"Generate 3 short form subtasks for the task: {task_title}.",
            }
        ],
    )

    subtasks = []
        
    for choice in response.choices:

        subtask_content = choice.message.content.strip()
        subtask_lines = subtask_content.split("\n") 
       
        for line in subtask_lines:
            if line.strip():  
                subtasks.append({"content": line.strip()})

    return jsonify(subtasks)

@tasks_blueprint.route("/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": f"Task {task_id} deleted"}), 200

@tasks_blueprint.route("/task_info/<int:task_id>", methods=["GET"])
def get_task_info(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    task_info = {
        "title": task.title,
        "id": task.id,
        "description": task.description,
        "sub1": task.sub1,
        "sub2": task.sub2,
        "sub3": task.sub3,
    }

    return jsonify(task_info), 200

@tasks_blueprint.route("/update_task/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.sub1 = data.get("sub1", task.sub1)
    task.sub2 = data.get("sub2", task.sub2)
    task.sub3 = data.get("sub3", task.sub3)

    db.session.commit()

    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "sub1": task.sub1,
        "sub2": task.sub2,
        "sub3": task.sub3,
    }), 200

@tasks_blueprint.route("/update_task_completion/<int:task_id>", methods=["PUT"])
def update_task_completion(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    task.completed = data.get("completed", task.completed)  # Update task completion
    db.session.commit()  # Commit the changes to the database

    return jsonify({
        "id": task.id,
        "title": task.title,
        "completed": task.completed,
    }), 200