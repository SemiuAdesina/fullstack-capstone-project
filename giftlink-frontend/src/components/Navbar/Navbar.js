import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Task 1: Check for authentication token and set user state
    const authTokenFromSession = sessionStorage.getItem("auth-token");
    const nameFromSession = sessionStorage.getItem("name");

    if (authTokenFromSession) {
      if (isLoggedIn && nameFromSession) {
        setUserName(nameFromSession);  // Set username if logged in
      } else {
        // Clear session if authentication is invalid
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUserName]);

  const handleLogout = () => {
    // Task 2: Handle user logout
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate(`/app`);
  };

  const profileSection = () => {
    // Task 3: Navigate to profile section
    navigate(`/app/profile`);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        id="navbar_container"
      >
        {/* Task 4: Navbar Brand */}
        <a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>
          GiftLink
        </a>

        {/* Task 5: Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Task 6: Navbar Links */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Task 6.1: Home Link */}
            <li className="nav-item">
              <a className="nav-link" href="/home.html">
                Home
              </a> {/* Link to home.html */}
            </li>

            {/* Task 6.2: Gifts Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/app">
                Gifts
              </Link> {/* Updated Link */}
            </li>

            {/* Task 6.3: Search Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/app/search">
                Search
              </Link>
            </li>

            {/* Task 6.4: Add Gift Link */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/app/add-gift">
                  Add Gift
                </Link>
              </li>
            )}

            {/* Task 7: User Authentication Links */}
            <ul className="navbar-nav ml-auto">
              {isLoggedIn ? (
                <>
                  {/* Task 7.1: Show user name if logged in */}
                  <li className="nav-item">
                    <span
                      className="nav-link"
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={profileSection}
                    >
                      Welcome, {userName}
                    </span>
                  </li>

                  {/* Task 7.2: Logout Button */}
                  <li className="nav-item">
                    <button
                      className="nav-link login-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Task 7.3: Login and Register links if not logged in */}
                  <li className="nav-item">
                    <Link className="nav-link login-btn" to="/app/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link register-btn" to="/app/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </ul>
        </div>
      </nav>
    </>
  );
}
