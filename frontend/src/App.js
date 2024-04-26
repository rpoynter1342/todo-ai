import React, { useEffect, useState } from "react";
import "./App.css";
import { CreateTask } from "./components/CreateTask";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  const handleTaskDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    console.log(updatedTasks);
    setTasks(updatedTasks);
  };
  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks); // Update the task list
  };
  return (
    <div className="App">
      <CreateTask addTask={addTask} />
      <TaskList
        props={tasks}
        onTaskDelete={handleTaskDelete}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}

export default App;
