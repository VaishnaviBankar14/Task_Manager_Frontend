
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your tasks.");
          return;
        }

        const response = await apiRequest("/tasks", { token });
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.message || "Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p role="status">Loading tasks...</p>;
  }

  if (error) {
    return (
      <section>
        <h1>My Tasks</h1>
        <p role="alert">{error}</p>
        {!localStorage.getItem("token") && (
          <Link to="/login">Go to Login</Link>
        )}
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>My Tasks</h1>

      <Link to="/tasks/new">+ Create Task</Link>

      {tasks.length === 0 ? (
        <p>No tasks yet. Create your first task!</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <article key={task._id}>
              <h2>
                <Link to={`/tasks/${task._id}`}>{task.title}</Link>
              </h2>

              <p>{task.description || "No description provided."}</p>
              <p>Status: {task.status}</p>

              {task.dueDate && (
                <p>
                  Due date:{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;
