import React from "react";
import { FaUser, FaCamera } from "react-icons/fa";
import "./ProfileHeader.css";
import moment from "moment";

const ProfileHeader = ({
  user,
  editing,
  previewImage,
  handleImageClick,
  fileInputRef,
  handleImageChange,
  cssNamespace = "ph",
}) => {
  const classWithPrefix = (className) => `${cssNamespace}-${className}`;

  return (
    <div className={classWithPrefix("header")}>
      <div className={classWithPrefix("header-content")}>
        <div className={classWithPrefix("avatar-container")}>
          <div className={classWithPrefix("avatar")}>
            {user.avatar || previewImage ? (
              <img
                src={previewImage || user.avatar}
                alt={user.username}
                className={classWithPrefix("user-avatar")}
              />
            ) : (
              <div className={classWithPrefix("default-avatar")}>
                <FaUser />
              </div>
            )}
            {editing && (
              <button
                className={classWithPrefix("avatar-upload")}
                onClick={handleImageClick}
                aria-label="Upload avatar"
              >
                <FaCamera />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </button>
            )}
          </div>
        </div>

        <div className={classWithPrefix("user-details")}>
          <h2>{user.name || user.fullName}</h2>
          <p className={classWithPrefix("username")}>@{user.username}</p>
          {user.createdAt && (
            <p className={classWithPrefix("join-date")}>
              Thành viên từ {moment(user.createdAt).format("DD/MM/YYYY")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
