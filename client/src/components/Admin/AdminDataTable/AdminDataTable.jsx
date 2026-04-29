import React from "react";
import {
  MdRefresh,
  MdOutlineWarningAmber,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
  MdVisibility,
  MdSettings,
  MdDelete,
  MdBlock,
  MdLockOpen,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import "./AdminDataTable.css";

function AdminDataTable({
  data = [],
  columns = [],
  renderRow,
  loading = false,
  error = null,
  onRetry,
  emptyStateProps = {},
  sortable = false,
  onSort,
  onView,
  onEdit,
  onDelete,
  onBan,
  pagination = null,
  onPageChange,
  showIndex = true,
  currentUserId = null,
}) {
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });

  const handleSort = (key) => {
    if (!sortable || !onSort) return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const handleDelete = (id) => {
    onDelete && onDelete(id);
  };

  if (loading) {
    return (
      <div className="admin-datatable admin-datatable--loading">
        <div className="admin-datatable__glass"></div>
        <div className="admin-datatable__loading">
          <div className="admin-datatable__loading-spinner"></div>
          <p className="admin-datatable__loading-text">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-datatable admin-datatable--error">
        <div className="admin-datatable__glass"></div>
        <div className="admin-datatable__error">
          <MdOutlineWarningAmber className="admin-datatable__error-icon" />
          <p className="admin-datatable__error-message">{error}</p>
          {onRetry && (
            <button
              className="admin-datatable__retry-button"
              onClick={onRetry}
            >
              <MdRefresh /> Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data.length) {
    const { icon, title, message, actionButton } = emptyStateProps;

    return (
      <div className="admin-datatable admin-datatable--empty">
        <div className="admin-datatable__glass"></div>
        <div className="admin-datatable__empty">
          {icon && <div className="admin-datatable__empty-icon">{icon}</div>}
          {title && <h3 className="admin-datatable__empty-title">{title}</h3>}
          {message && (
            <p className="admin-datatable__empty-message">{message}</p>
          )}
          {actionButton && (
            <div className="admin-datatable__empty-action">{actionButton}</div>
          )}
        </div>
      </div>
    );
  }

  const defaultRenderRow = (item, index) => {
    const itemId = item._id || item.id;
    
    // Tính toán số thứ tự thực tế dựa trên phân trang
    const actualIndex = pagination 
      ? pagination.startItem + index
      : index + 1;
    
    // Lấy custom actions nếu có
    const actionsColumn = columns.find(col => col.key === "actions");
    const customActions = actionsColumn?.customActions?.(item) || {};

    return (
      <tr key={itemId || Math.random().toString()}>
        {showIndex && (
          <td className="admin-datatable__index-cell">
            {actualIndex}
          </td>
        )}
        {columns.map((column) => {
          if (column.key === "actions") {
            const {
              canView = true,
              canEdit = true,
              canDelete = true,
              canBan = false,
              isBanned = false,
            } = customActions;

            // Hide delete button if this is the current logged-in user
            const canDeleteUser = canDelete && itemId !== currentUserId;

            return (
              <td
                key={`${itemId}-actions`}
                className="admin-datatable__actions-cell"
              >
                {onView && canView && (
                  <button
                    className="admin-datatable__action-btn admin-datatable__view-btn"
                    onClick={() => onView(itemId)}
                    title="Xem chi tiết"
                  >
                    <MdVisibility />
                  </button>
                )}

                {onEdit && canEdit && (
                  <button
                    className="admin-datatable__action-btn admin-datatable__edit-btn"
                    onClick={() => onEdit(itemId)}
                    title="Quản lý tài khoản"
                  >
                    <MdSettings />
                  </button>
                )}

                {onBan && canBan && (
                  <button
                    className={`admin-datatable__action-btn ${
                      isBanned
                        ? "admin-datatable__unban-btn"
                        : "admin-datatable__ban-btn"
                    }`}
                    onClick={() => onBan(itemId)}
                    title={isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                  >
                    {isBanned ? <MdLockOpen /> : <MdBlock />}
                  </button>
                )}

                {onDelete && canDeleteUser && (
                  <button
                    className="admin-datatable__action-btn admin-datatable__delete-btn"
                    onClick={() => handleDelete(itemId)}
                    title="Xóa"
                  >
                    <MdDelete />
                  </button>
                )}
              </td>
            );
          }

          return (
            <td
              key={`${itemId}-${column.key}`}
              className={
                column.hideOnMobile ? `hide-${column.hideOnMobile}` : ""
              }
            >
              {column.render ? column.render(item) : item[column.key]}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="admin-datatable">
      <div className="admin-datatable__glass"></div>
      <div className="admin-datatable__container">
        <div className="admin-datatable__responsive">
          <table className="admin-datatable__table">
            <thead>
              <tr>
                {showIndex && (
                  <th className="admin-datatable__index-header">STT</th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${
                      column.hideOnMobile ? `hide-${column.hideOnMobile}` : ""
                    } ${
                      sortable && column.key !== "actions" ? "sortable" : ""
                    }`}
                    onClick={() =>
                      sortable &&
                      column.key !== "actions" &&
                      handleSort(column.key)
                    }
                  >
                    <div className="admin-datatable__header-content">
                      <span>{column.title}</span>
                      {sortable && sortConfig.key === column.key && (
                        <span className="admin-datatable__sort-icon">
                          {sortConfig.direction === "asc" ? (
                            <MdOutlineArrowUpward />
                          ) : (
                            <MdOutlineArrowDownward />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow
                ? data.map((item, index) => renderRow(item, index))
                : data.map((item, index) => defaultRenderRow(item, index))}
            </tbody>
          </table>
        </div>
        
        {pagination && (
          <div className="admin-datatable__pagination">
            <div className="admin-datatable__pagination-info">
              Hiển thị {pagination.startItem}-{pagination.endItem} / {pagination.totalItems}
            </div>
            <div className="admin-datatable__pagination-controls">
              <button 
                className="admin-datatable__pagination-btn"
                disabled={pagination.currentPage <= 1}
                onClick={() => onPageChange(pagination.currentPage - 1)}
              >
                <MdKeyboardArrowLeft />
              </button>
              
              {pagination.totalPages <= 5 ? (
                // If 5 or fewer pages, show all page numbers
                [...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`admin-datatable__pagination-btn ${
                      pagination.currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                // Show first page, current page with neighbors, and last page
                <>
                  <button
                    className={`admin-datatable__pagination-btn ${
                      pagination.currentPage === 1 ? "active" : ""
                    }`}
                    onClick={() => onPageChange(1)}
                  >
                    1
                  </button>
                  
                  {pagination.currentPage > 3 && <span className="admin-datatable__pagination-ellipsis">...</span>}
                  
                  {pagination.currentPage > 2 && (
                    <button
                      className="admin-datatable__pagination-btn"
                      onClick={() => onPageChange(pagination.currentPage - 1)}
                    >
                      {pagination.currentPage - 1}
                    </button>
                  )}
                  
                  {pagination.currentPage !== 1 && pagination.currentPage !== pagination.totalPages && (
                    <button
                      className="admin-datatable__pagination-btn active"
                      onClick={() => onPageChange(pagination.currentPage)}
                    >
                      {pagination.currentPage}
                    </button>
                  )}
                  
                  {pagination.currentPage < pagination.totalPages - 1 && (
                    <button
                      className="admin-datatable__pagination-btn"
                      onClick={() => onPageChange(pagination.currentPage + 1)}
                    >
                      {pagination.currentPage + 1}
                    </button>
                  )}
                  
                  {pagination.currentPage < pagination.totalPages - 2 && <span className="admin-datatable__pagination-ellipsis">...</span>}
                  
                  <button
                    className={`admin-datatable__pagination-btn ${
                      pagination.currentPage === pagination.totalPages ? "active" : ""
                    }`}
                    onClick={() => onPageChange(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
              
              <button 
                className="admin-datatable__pagination-btn"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => onPageChange(pagination.currentPage + 1)}
              >
                <MdKeyboardArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDataTable;
