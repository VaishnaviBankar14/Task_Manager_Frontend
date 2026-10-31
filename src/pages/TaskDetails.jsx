
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

        const response = await apiRequest(`/tasks/${id}`, {
          token,
        });

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
    return (
      <div className="page-loading" role="status">
        Loading task details...
      </div>
    );
  }

  if (error && !task) {
    return (
      <section className="details-page">
        <h1>Task Details</h1>
        <p className="form-error" role="alert">{error}</p>
        <Link to="/" className="secondary-btn">
          Back to Dashboard
        </Link>
      </section>
    );
  }

  if (!task) {
    return (
      <section className="details-page">
        <h1>Task not found</h1>
        <Link to="/">Back to Dashboard</Link>
      </section>
    );
  }

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <section className="details-page">

      <div className="details-heading">
        <div>
          <span className="auth-eyebrow">TASK DETAILS</span>
          <h1>{task.title}</h1>
        </div>

        <span className={`status-badge ${task.status}`}>
          {statusLabels[task.status] || task.status}
        </span>
      </div>

      <div className="details-content">

        <div className="detail-item">
          <span className="detail-label">Description</span>
          <p>
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="detail-item">
          <span className="detail-label">Status</span>
          <p>{statusLabels[task.status] || task.status}</p>
        </div>

        <div className="detail-item">
          <span className="detail-label">Due date</span>
          <p>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </p>
        </div>

      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="details-actions">

        <Link
          to={`/tasks/${task._id}/edit`}
          className="primary-btn"
        >
          Edit Task
        </Link>

        <button
          type="button"
          className="danger-btn"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Task"}
        </button>

        <Link to="/" className="secondary-btn">
          Back to Dashboard
        </Link>

      </div>

    </section>
  );
}

export default TaskDetails;

