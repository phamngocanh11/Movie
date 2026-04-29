import React from "react";
import { FaLock, FaShieldAlt, FaKey, FaCheck } from "react-icons/fa";
import "./PasswordChange.css";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const PasswordChange = ({
  passwordForm,
  passwordErrors,
  handlePasswordChange,
  handlePasswordSubmit,
  cssNamespace = "pc",
}) => {
  const classWithPrefix = (className) => `${cssNamespace}-${className}`;

  return (
    <div className={classWithPrefix("container")}>
      <div className={classWithPrefix("section")}>
        <h3 className={classWithPrefix("section-title")}>
          <FaShieldAlt className={classWithPrefix("section-icon")} />
          Đổi mật khẩu
        </h3>

        <form
          className={classWithPrefix("form")}
          onSubmit={handlePasswordSubmit}
        >
          <div className={classWithPrefix("form-row")}>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              label="Mật khẩu hiện tại"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              icon={<FaKey />}
            />
          </div>

          <div className={classWithPrefix("form-row")}>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              label="Mật khẩu mới"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              icon={<FaLock />}
            />
          </div>

          <div className={classWithPrefix("form-row")}>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmPassword}
              icon={<FaCheck />}
            />
          </div>

          <div className={classWithPrefix("form-actions")}>
            <Button type="submit" variant="primary" hasIcon={true}>
              <FaLock /> <span>Cập nhật mật khẩu</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
