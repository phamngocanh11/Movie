import React from "react";
import { FaUser, FaLock, FaHeart, FaHistory } from "react-icons/fa";
import "./ProfileTabs.css";

const ProfileTabs = ({ activeTab, setActiveTab, cssNamespace = "pt" }) => {
  const classWithPrefix = (className) => `${cssNamespace}-${className}`;

  const tabs = [
    { id: "profile", icon: <FaUser />, label: "Thông tin cá nhân" },
    { id: "password", icon: <FaLock />, label: "Đổi mật khẩu" },
    { id: "favorites", icon: <FaHeart />, label: "Phim yêu thích" },
    { id: "history", icon: <FaHistory />, label: "Lịch sử xem" },
  ];

  return (
    <div className={classWithPrefix("tabs-container")}>
      <div className={classWithPrefix("tabs")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${classWithPrefix("tab")} ${
              activeTab === tab.id ? classWithPrefix("tab-active") : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={classWithPrefix("tab-icon")}>{tab.icon}</span>
            <span className={classWithPrefix("tab-label")}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
