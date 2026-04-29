import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Movie</h4>
          <p>Trang web xem phim trực tuyến chất lượng cao.</p>
          <div className="social-links">
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Liên kết</h4>
          <ul>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/faq">Câu hỏi thường gặp</Link>
            </li>
            <li>
              <Link to="/terms">Điều khoản dịch vụ</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Danh mục</h4>
          <ul>
            <li>
              <Link to="/movies">Phim lẻ</Link>
            </li>
            <li>
              <Link to="/series">Phim bộ</Link>
            </li>
            <li>
              <Link to="/trending">Phim đang hot</Link>
            </li>
            <li>
              <Link to="/new-releases">Phim mới</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Trợ giúp</h4>
          <ul>
            <li>
              <Link to="/account">Tài khoản</Link>
            </li>
            <li>
              <Link to="/watch-guide">Hướng dẫn xem</Link>
            </li>
            <li>
              <Link to="/feedback">Góp ý</Link>
            </li>
            <li>
              <Link to="/report">Báo lỗi</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Movie. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
