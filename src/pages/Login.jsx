
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = formData.email.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: {
          email,
          password: formData.password,
        },
      });

      const token =
        response.token ||
        response.data?.token ||
        response.data?.data?.token;

      if (!token) {
        throw new Error("Login response does not contain a token.");
      }

      localStorage.setItem("token", token);
      navigate("/", { replace: true });

    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-heading">
        <span className="auth-eyebrow">WELCOME BACK</span>
        <h1>Login to TaskFlow</h1>
        <p>Sign in to organize your work and manage your tasks.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">

        <div className="form-group">
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn auth-submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login to Account"}
        </button>

      </form>

      <p className="auth-footer">
        Don't have an account?
        {" "}
        <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}

export default Login;


