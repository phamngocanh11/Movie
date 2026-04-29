import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaClock,
  FaFire,
  FaHome,
  FaStar,
  FaTheaterMasks,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-nav">
        <div className="nav-category">
          <h3 className="category-title">Menu</h3>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" end>
                <FaHome className="nav-icon" />
                <span className="nav-text">Trang chủ</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/category/trending" className="nav-link">
                <FaFire className="nav-icon" />
                <span className="nav-text">Đang hot</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/category/new" className="nav-link">
                <FaClock className="nav-icon" />
                <span className="nav-text">Mới cập nhật</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/category/top" className="nav-link">
                <FaStar className="nav-icon" />
                <span className="nav-text">Xếp hạng cao</span>
              </NavLink>
            </li>
          </ul>
          <div className="nav-category">
            <h3 className="category-title">Thể loại</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/movies" className="nav-link">
                  <FaTheaterMasks className="nav-icon" />
                  <span className="nav-text">Phim lẻ</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="nav-category"></div>
      </div>
    </aside>
  );
}

export default Sidebar;
