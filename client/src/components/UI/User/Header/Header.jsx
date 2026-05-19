import React, { useEffect, useRef, useState } from "react";
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
  decryptedUserData,
  getAvatarUrl,
  getUserSingleInfo,
  isAuthenticated,
  logout,
} from "../../../../utils/auth";
import userService from "../../../../services/userService";

function Header({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogin, setUserLogin] = useState({});
  const dropdownRef = useRef(null);
  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=random&size=150";

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        setIsLoggedIn(false);
        setUserLogin({});
        return;
      }

      setIsLoggedIn(true);

      const localUser = decryptedUserData() || {};
      setUserLogin({
        ...localUser,
        avatar: getAvatarUrl(localUser.avatar),
      });

      const userId = localUser._id || getUserSingleInfo("_id");
      if (!userId) return;

      try {
        const freshUser = await userService.getUserById(userId);
        if (freshUser) {
          setUserLogin({
            ...freshUser,
            avatar: getAvatarUrl(freshUser.avatar),
          });
        }
      } catch (error) {
        console.error("Error refreshing header user:", error);
      }
    };

    loadUser();

    const handleUserUpdated = (event) => {
      const updatedUser = event.detail || decryptedUserData() || {};
      setIsLoggedIn(Boolean(updatedUser._id));
      setUserLogin({
        ...updatedUser,
        avatar: getAvatarUrl(updatedUser.avatar),
      });
    };

    window.addEventListener("user-updated", handleUserUpdated);
    return () => window.removeEventListener("user-updated", handleUserUpdated);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showDropdown]);

  const handleSearch = () => {};

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Mở menu"
        >
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
            <div className="user-profile" ref={dropdownRef}>
              <button
                className="avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Mở menu tài khoản"
                aria-expanded={showDropdown}
              >
                <img
                  src={getAvatarUrl(userLogin?.avatar) || defaultAvatar}
                  alt="User avatar"
                  className="header-avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
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
