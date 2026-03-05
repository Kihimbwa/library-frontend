import { useState } from "react";
import axios from "axios";

// Fallback API URL if environment variable is not set
const API_URL = process.env.REACT_APP_API_URL || "https://my-project-5fi1.onrender.com";

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/register/`, formData); // ✅ fixed
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("member_id", res.data.member_id);
        localStorage.setItem("username", formData.username);
        onRegisterSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">📖 Create Account</h2>
        <p className="auth-subtitle">Join our library system today!</p>
        
        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">🔑 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">📱 Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">📍 Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your address"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? "⏳ Creating Account..." : "✨ Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={onSwitchToLogin}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;