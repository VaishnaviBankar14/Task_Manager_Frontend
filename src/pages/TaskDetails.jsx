
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTask() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view this task.");
        }

        const response = await apiRequest(`/tasks/${id}`, { token });

        if (!cancelled) {
          setTask(response.data.task);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load task.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTask();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to delete this task.");
      }

      await apiRequest(`/tasks/${id}`, {
        method: "DELETE",
        token,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to delete task.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p role="status">Loading task...</p>;
  }

  if (error && !task) {
    return (
      <section>
        <h1>Task Details</h1>
        <p role="alert">{error}</p>
        <Link to="/">Back to My Tasks</Link>
      </section>
    );
  }

  if (!task) {
    return <p>Task not found.</p>;
  }

  return (
    <section>
      <h1>{task.title}</h1>

      <p>
        <strong>Description:</strong>{" "}
        {task.description || "No description provided."}
      </p>

      <p>
        <strong>Status:</strong> {task.status}
      </p>

      <p>
        <strong>Due date:</strong>{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "No due date"}
      </p>

      {error && <p role="alert">{error}</p>}

      <div>
        <Link to={`/tasks/${task._id}/edit`}>Edit Task</Link>{" "}
        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete Task"}
        </button>{" "}
        <Link to="/">Back to My Tasks</Link>
      </div>
    </section>
  );
}

export default TaskDetails;
