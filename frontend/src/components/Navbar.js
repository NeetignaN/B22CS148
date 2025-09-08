import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="my-link">
        Home
      </Link>
      {!user ? (
        <>
          <Link to="/register" className="my-link">
            Register
          </Link>
          <Link to="/login" className="my-link">
            Login
          </Link>
        </>
      ) : (
        <>
          <Link to="/dashboard" className="my-link">
            Dashboard
          </Link>
          <button onClick={handleLogout} className="my-link">
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
