import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import "./Notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "new-movie",
      title: "Phim mới",
      message: "Avengers: Endgame vừa được thêm vào",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "comment-reply",
      title: "Trả lời bình luận",
      message: "John Doe đã trả lời bình luận của bạn",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      type: "new-episode",
      title: "Tập mới",
      message: "Breaking Bad có tập mới",
      time: "2 giờ trước",
      read: true,
    },
  ]);

  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo</h3>
            {notifications.length > 0 && (
              <div className="notification-actions">
                <button onClick={handleMarkAllAsRead}>Đánh dấu đã đọc</button>
                <button onClick={handleClearAll}>Xóa tất cả</button>
              </div>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <FaBell />
                <p>Không có thông báo mới</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${
                    notif.read ? "read" : "unread"
                  }`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                  <button
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
