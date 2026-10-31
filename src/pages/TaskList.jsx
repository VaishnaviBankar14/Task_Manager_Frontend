
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(task => task.status === "pending").length,
    progress: tasks.filter(task => task.status === "in-progress").length,
    completed: tasks.filter(task => task.status === "completed").length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filter === "all" || task.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, filter]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return <div className="page-message">Loading your workspace...</div>;
  }

  if (error && !localStorage.getItem("token")) {
    return (
      <section className="empty-state">
        <h2>Welcome to TaskFlow</h2>
        <p>Log in to access and manage your tasks.</p>
        <Link className="primary-button" to="/login">Go to Login</Link>
      </section>
    );
  }

  if (error) {
    return (
      <section className="empty-state">
        <h2>Something went wrong</h2>
        <p role="alert">{error}</p>
        <button onClick={fetchTasks}>Try Again</button>
      </section>
    );
  }

  const cards = [
    { label: "Total Tasks", value: stats.total, icon: "▤", type: "total" },
    { label: "Pending", value: stats.pending, icon: "◷", type: "pending" },
    { label: "In Progress", value: stats.progress, icon: "↗", type: "progress" },
    { label: "Completed", value: stats.completed, icon: "✓", type: "completed" },
  ];

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>My Tasks</h1>
          <p className="welcome-description">
            Organize your work. Stay focused. Get things done.
          </p>
        </div>

        <Link to="/tasks/new" className="primary-button">
          + Create Task
        </Link>
      </section>

      <section className="stats-grid">
        {cards.map(card => (
          <article className="stat-card" key={card.type}>
            <div className={`stat-icon ${card.type}`}>{card.icon}</div>
            <div>
              <p>{card.label}</p>
              <h2>{card.value}</h2>
            </div>
          </article>
        ))}
      </section>

      <section className="tasks-section">
        <div className="tasks-heading">
          <div>
            <h2>All Tasks</h2>
            <p>Manage and track your activities</p>
          </div>
          <span className="task-count">{filteredTasks.length} tasks</span>
        </div>

        <div className="task-toolbar">
          <input
            type="search"
            className="task-search"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search tasks"
          />

          <select
            className="task-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label="Filter tasks by status"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>{tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</h3>
            <p>
              {tasks.length === 0
                ? "Create your first task and start organizing your work."
                : "Try changing your search or filter."}
            </p>
            {tasks.length === 0 && (
              <Link to="/tasks/new" className="primary-button">
                Create your first task
              </Link>
            )}
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map(task => (
              <article className="task-card" key={task._id}>
                <div className="task-card-top">
                  <span className={`status-badge ${task.status}`}>
                    {task.status === "in-progress"
                      ? "In Progress"
                      : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  <span className="task-menu">•••</span>
                </div>

                <h3>
                  <Link to={`/tasks/${task._id}`}>{task.title}</Link>
                </h3>

                <p className="task-description">
                  {task.description || "No description provided."}
                </p>

                <div className="task-card-footer">
                  <span>
                    {task.dueDate
                      ? `Due ${formatDate(task.dueDate)}`
                      : "No due date"}
                  </span>
                  <Link to={`/tasks/${task._id}`} className="view-task">
                    View details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TaskList;



