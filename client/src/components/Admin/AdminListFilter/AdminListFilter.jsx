import React, { useEffect, useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdClose,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import "./AdminListFilter.css";

function AdminListFilter({
  filters = [],
  onFilterChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  collapsible = true,
}) {
  const [activeFilters, setActiveFilters] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFilterChange = (filterId, value) => {
    if (onFilterChange) {
      onFilterChange(filterId, value);
    }
  };

  const handleSearchChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleResetFilter = (filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId, "");
    }
  };

  useEffect(() => {
    let count = 0;
    filters.forEach((filter) => {
      if (
        filter.value &&
        ((Array.isArray(filter.value) && filter.value.length > 0) ||
          (!Array.isArray(filter.value) && filter.value !== ""))
      ) {
        count++;
      }
    });
    setActiveFilters(count);
  }, [filters]);

  return (
    <div className="admin-list-filter">
      <div className="admin-list-filter__glass"></div>

      <div className="admin-list-filter__search">
        <MdSearch className="admin-list-filter__search-icon" />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="admin-list-filter__search-input"
        />
        {searchValue && (
          <button
            className="admin-list-filter__search-clear"
            onClick={() => onSearchChange && onSearchChange("")}
          >
            <MdClose />
          </button>
        )}

        {collapsible && (
          <button
            className="admin-list-filter__toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <MdFilterList className="admin-list-filter__toggle-icon" />
            <span className="admin-list-filter__toggle-text">
              Bộ lọc{" "}
              {activeFilters > 0 && (
                <span className="admin-list-filter__active-badge">
                  {activeFilters}
                </span>
              )}
            </span>
            {isCollapsed ? (
              <MdOutlineKeyboardArrowDown className="admin-list-filter__toggle-arrow" />
            ) : (
              <MdOutlineKeyboardArrowUp className="admin-list-filter__toggle-arrow" />
            )}
          </button>
        )}
      </div>

      <div
        className={`admin-list-filter__filters ${
          isCollapsed && collapsible ? "collapsed" : ""
        }`}
      >
        {filters.map((filter) => (
          <div key={filter.id} className="admin-list-filter__group">
            <label className="admin-list-filter__label">{filter.label}</label>

            {filter.type === "select" && (
              <div className="admin-list-filter__select-wrapper">
                <select
                  value={filter.value || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.id, e.target.value)
                  }
                  className="admin-list-filter__select"
                >
                  <option value="">
                    {filter.placeholder || `${filter.label}`}
                  </option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {filter.value && (
                  <button
                    className="admin-list-filter__reset"
                    onClick={() => handleResetFilter(filter.id)}
                    aria-label="Xóa bộ lọc"
                  >
                    <MdClose size={16} />
                  </button>
                )}
              </div>
            )}

            {filter.type === "radio" && (
              <div className="admin-list-filter__radio-group">
                {filter.options.map((option) => (
                  <label
                    key={option.value}
                    className="admin-list-filter__radio"
                  >
                    <input
                      type="radio"
                      name={filter.id}
                      value={option.value}
                      checked={filter.value === option.value}
                      onChange={() =>
                        handleFilterChange(filter.id, option.value)
                      }
                    />
                    <span className="admin-list-filter__radio-text">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {filter.type === "checkbox" && (
              <div className="admin-list-filter__checkbox-group">
                {filter.options.map((option) => (
                  <label
                    key={option.value}
                    className="admin-list-filter__checkbox"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={
                        filter.value && filter.value.includes(option.value)
                      }
                      onChange={(e) => {
                        let newValue = [...(filter.value || [])];
                        if (e.target.checked) {
                          newValue.push(option.value);
                        } else {
                          newValue = newValue.filter((v) => v !== option.value);
                        }
                        handleFilterChange(filter.id, newValue);
                      }}
                    />
                    <span className="admin-list-filter__checkbox-text">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {filter.type === "range" && (
              <div className="admin-list-filter__range">
                <input
                  type="range"
                  min={filter.min || 0}
                  max={filter.max || 100}
                  value={filter.value || filter.min || 0}
                  onChange={(e) =>
                    handleFilterChange(filter.id, e.target.value)
                  }
                  className="admin-list-filter__range-input"
                />
                <div className="admin-list-filter__range-value">
                  {filter.value || filter.min || 0}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminListFilter;
