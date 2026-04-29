import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import "./Header.css";
import SearchBar from "../../SearchBar/SearchBar";
import Button from "../../Button/Button";
import ThemeToggle from "../../../ThemeToggle/ThemeToggle";
import {
  getUserSingleInfo,
  isAuthenticated,
  logout,
} from "../../../../utils/auth";

function Header({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogin, setUserLogin] = useState({});

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setUserLogin({
        avatar: getUserSingleInfo("avatar"),
        username: getUserSingleInfo("username"),
        email: getUserSingleInfo("email"),
      });
    }
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/" className="logo">
          <span className="logo-icon">M</span>
          <span className="logo-text">Movie</span>
        </Link>
      </div>

      <div className="header-right">
        <SearchBar onSearch={handleSearch} />
        <ThemeToggle />
        {isLoggedIn ? (
          <>
            <div className="user-profile">
              <button
                className="avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img src={userLogin?.avatar} alt="Avatar" />
              </button>

              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="username">{userLogin.username}</p>
                    <p className="email">{userLogin.email}</p>
                  </div>

                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUser /> Tài khoản
                      </Link>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-link">
              <Button variant="secondary" hasIcon>
                <FaSignInAlt />
                <span>Đăng nhập</span>
              </Button>
            </Link>
            <Link to="/register" className="btn-link">
              <Button variant="primary" hasIcon>
                <FaUserPlus />
                <span>Đăng ký</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
