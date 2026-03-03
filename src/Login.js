import { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Explicit JSON keys
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login/`,
        {
          username: formData.username, // Change to "email" if your backend expects email
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // Successful login
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("member_id", res.data.member_id);
        localStorage.setItem("role", res.data.role);
        onLoginSuccess(res.data);
      }
    } catch (err) {
      // Catch 400 or other errors
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">📚 Library Login</h2>
        <p className="auth-subtitle">Welcome back! Please login to continue</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? "⏳ Logging in..." : "🚀 Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span className="auth-link" onClick={onSwitchToRegister}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;