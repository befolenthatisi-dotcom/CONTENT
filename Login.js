import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";
import Navbar from "../components/Navbar.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Is the backend running?"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-page">
        <div
          className="login-art"
          style={{
            backgroundImage:
              "#17252b;",
          }}
        >
          <h2>Welcome back, creator</h2>
          <p>
            Manage your content, schedule new posts, moderate comments and track
            how your viewers engage, all from one place.
          </p>
          <ul>
            <li>Publish, draft or schedule content</li>
            <li>Approve or hide viewer comments</li>
            <li>See views, likes and top content</li>
          </ul>
        </div>

        <div className="login-form-side">
          <form className="panel auth-card" onSubmit={submit}>
            <h2>Creator Login</h2>
            <p className="muted">Sign in to manage your content.</p>
            {error && <div className="error">{error}</div>}
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <Link to="/" className="btn btn-outline back-btn full">Back</Link>
          </form>
        </div>
      </div>
    </div>
  );
}