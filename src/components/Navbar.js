import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  useLocation(); 
  const loggedIn = !!localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar">
      <Link to="/" className="brand">ThinkSpace</Link>

      <div className="nav-actions">
        <NavLink to="/" end className={linkClass}>Home</NavLink>

        {loggedIn ? (
          <>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <button className="nav-link nav-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>Creator login</NavLink>
        )}
      </div>
    </nav>
  );
}