
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    let cancelled = false;

    async function fetchTask() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiRequest(`/tasks/${id}`, { token });
        const task = response.data.task;

        if (!cancelled) {
          setFormData({
            title: task.title || "",
            description: task.description || "",
            status: task.status || "pending",
            dueDate: task.dueDate
              ? new Date(task.dueDate).toISOString().slice(0, 10)
              : "",
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTask();

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title || title.length > 100) {
      setError("Title is required and must be at most 100 characters.");
      return;
    }

    if (description.length > 500) {
      setError("Description must be at most 500 characters.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in before saving a task.");
      }

      const body = {
        title,
        description,
        status: formData.status,
        dueDate: formData.dueDate || null,
      };

      if (isEditing) {
        await apiRequest(`/tasks/${id}`, {
          method: "PUT",
          token,
          body,
        });
      } else {
        await apiRequest("/tasks", {
          method: "POST",
          token,
          body,
        });
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p role="status">Loading task...</p>;

  return (
    <section>
      <h1>{isEditing ? "Edit Task" : "Create Task"}</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate">Due date (optional)</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Task"
              : "Create Task"}
        </button>

        <Link to="/">Cancel</Link>
      </form>
    </section>
  );
}

export default TaskForm;
