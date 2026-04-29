import React, { useState, useRef, useEffect } from "react";
import "./MultiSelect.css";

const MultiSelect = ({
  name,
  label,
  options = [], // Đảm bảo options luôn là một mảng
  value = [],
  onChange,
  required = false,
  error = null,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Đảm bảo value luôn là một mảng
  const safeValue = Array.isArray(value) ? value : [];
  // Đảm bảo options luôn là một mảng
  const safeOptions = Array.isArray(options) ? options : [];

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus vào ô tìm kiếm khi mở dropdown
  useEffect(() => {
    if (dropdownVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownVisible]);

  const toggleDropdown = (e) => {
    if (e) e.stopPropagation();
    setDropdownVisible(!dropdownVisible);
    setSearchTerm("");
  };

  const handleOptionToggle = (optionValue) => {
    let newValues;

    if (safeValue.includes(optionValue)) {
      newValues = safeValue.filter((val) => val !== optionValue);
    } else {
      newValues = [...safeValue, optionValue];
    }

    // Gửi sự kiện onChange với đúng format
    onChange({
      target: {
        name,
        value: newValues,
        type: "select-multiple",
      },
    });
  };

  const removeTag = (optionValue, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newValues = safeValue.filter((val) => val !== optionValue);
    onChange({
      target: {
        name,
        value: newValues,
        type: "select-multiple",
      },
    });
  };

  const handleSearchChange = (e) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  // Lọc options theo search term
  const filteredOptions = safeOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`admin-multi-select-container ${error ? "admin-multi-select-error" : ""}`}
      ref={containerRef}
    >
      <div
        className="admin-multi-select-selected-tags"
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
      >
        {safeValue.length > 0 ? (
          safeValue.map((val) => {
            const option = safeOptions.find((opt) => opt.value === val);
            return (
              <div
                className="admin-multi-select-tag"
                key={val}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="admin-multi-select-tag-text">{option ? option.label : val}</span>
                <button
                  type="button"
                  className="admin-multi-select-remove-tag"
                  onClick={(e) => removeTag(val, e)}
                >
                  &times;
                </button>
              </div>
            );
          })
        ) : (
          <span className="admin-multi-select-placeholder">Chọn {label.toLowerCase()}...</span>
        )}

        <button
          type="button"
          className="admin-multi-select-dropdown-toggle"
          onClick={toggleDropdown}
        >
          <span className={`admin-multi-select-toggle-icon ${dropdownVisible ? "admin-multi-select-open" : ""}`}>
            ▼
          </span>
        </button>
      </div>

      {dropdownVisible && (
        <div className="admin-multi-select-options-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="admin-multi-select-search-container">
            <input
              type="text"
              className="admin-multi-select-search-input"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
          </div>

          <div className="admin-multi-select-options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`admin-multi-select-dropdown-option ${
                    safeValue.includes(option.value) ? "admin-multi-select-selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionToggle(option.value);
                  }}
                >
                  <div className="admin-multi-select-checkbox-indicator">
                    {safeValue.includes(option.value) && "✓"}
                  </div>
                  <span>{option.label}</span>
                </div>
              ))
            ) : (
              <div className="admin-multi-select-no-options">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
