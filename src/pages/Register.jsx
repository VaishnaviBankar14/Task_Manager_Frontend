
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (name.length < 2 || name.length > 50) {
      setError("Name must contain 2 to 50 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 72
    ) {
      setError("Password must contain 8 to 72 characters.");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/auth/register", {
        method: "POST",
        body: {
          name,
          email,
          password: formData.password,
        },
      });

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">

      <div className="auth-heading">
        <span className="auth-eyebrow">GET STARTED</span>

        <h1>Create your account</h1>

        <p>
          Join TaskFlow and organize your everyday work.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">

        <div className="form-group">
          <label htmlFor="name">Full name</label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            maxLength={50}
            autoComplete="name"
            required
          />
        </div>

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            required
          />

          <small className="input-hint">
            Password must contain 8 to 72 characters.
          </small>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="form-success" role="status">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn auth-submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

      </form>

      <p className="auth-footer">
        Already have an account?
        {" "}
        <Link to="/login">Login</Link>
      </p>

    </section>
  );
}

export default Register;


