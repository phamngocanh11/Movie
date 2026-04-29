import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "./ProfileInfo.css";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import moment from "moment";

const ProfileInfo = ({
  user,
  editing,
  formData,
  errors,
  handleChange,
  handleEditClick,
  handleCancelEdit,
  handleSubmit,
  cssNamespace = "pi",
}) => {
  const classWithPrefix = (className) => `${cssNamespace}-${className}`;

  return (
    <div className={classWithPrefix("container")}>
      <div className={classWithPrefix("section")}>
        <h3 className={classWithPrefix("section-title")}>
          <FaUser className={classWithPrefix("section-icon")} />
          Thông tin cá nhân
        </h3>

        {editing ? (
          <form className={classWithPrefix("form")} onSubmit={handleSubmit}>
            <div className={classWithPrefix("form-row")}>
              <Input
                type="text"
                id="name"
                name="name"
                label="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
            </div>

            <div className={classWithPrefix("form-row")}>
              <Input
                type="email"
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            <div className={classWithPrefix("form-actions")}>
              <Button type="submit" variant="primary" hasIcon={true}>
                <FaSave /> <span>Lưu thay đổi</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                hasIcon={true}
                onClick={handleCancelEdit}
              >
                <FaTimes /> <span>Hủy</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className={classWithPrefix("info-container")}>
            <div className={classWithPrefix("info-group")}>
              <div className={classWithPrefix("info-item")}>
                <div className={classWithPrefix("info-label")}>
                  <FaUser />
                  <span>Họ và tên</span>
                </div>
                <div className={classWithPrefix("info-value")}>
                  {user.name || user.name}
                </div>
              </div>

              <div className={classWithPrefix("info-item")}>
                <div className={classWithPrefix("info-label")}>
                  <FaUser />
                  <span>Tên người dùng</span>
                </div>
                <div className={classWithPrefix("info-value")}>
                  @{user.username}
                </div>
              </div>

              <div className={classWithPrefix("info-item")}>
                <div className={classWithPrefix("info-label")}>
                  <FaEnvelope />
                  <span>Email</span>
                </div>
                <div className={classWithPrefix("info-value")}>
                  {user.email}
                </div>
              </div>

              <div className={classWithPrefix("info-item")}>
                <div className={classWithPrefix("info-label")}>
                  <FaCalendarAlt />
                  <span>Ngày tham gia</span>
                </div>
                <div className={classWithPrefix("info-value")}>
                  {moment(user.createdAt).format("DD/MM/YYYY") || "Không rõ"}
                </div>
              </div>

              <div className={classWithPrefix("info-item")}>
                <div className={classWithPrefix("info-label")}>
                  <FaCalendarAlt />
                  <span>Cập nhật thông tin lần cuối</span>
                </div>
                <div className={classWithPrefix("info-value")}>
                  {moment(user.updatedAt).format("DD/MM/YYYY") || "Không rõ"}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              hasIcon={true}
              onClick={handleEditClick}
              className={classWithPrefix("edit-btn")}
            >
              <FaEdit /> <span>Chỉnh sửa thông tin</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
