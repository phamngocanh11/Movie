import React, { useState } from "react";
import "./AdvancedSearch.css";

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    actor: "",
    director: "",
    year: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm với params:", searchParams);
    // TODO: Implement search logic
  };

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      actor: "",
      director: "",
      year: "",
      category: "",
    });
  };

  return (
    <div className="advanced-search">
      <h2 className="advanced-search__title">Tìm Kiếm Nâng Cao</h2>
      
      <form className="advanced-search__form" onSubmit={handleSearch}>
        <div className="advanced-search__field">
          <label htmlFor="keyword">Từ khóa</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="Nhập tên phim..."
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="actor">Diễn viên</label>
          <input
            type="text"
            id="actor"
            name="actor"
            value={searchParams.actor}
            onChange={handleChange}
            placeholder="Nhập tên diễn viên..."
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="director">Đạo diễn</label>
          <input
            type="text"
            id="director"
            name="director"
            value={searchParams.director}
            onChange={handleChange}
            placeholder="Nhập tên đạo diễn..."
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="year">Năm sản xuất</label>
          <input
            type="number"
            id="year"
            name="year"
            value={searchParams.year}
            onChange={handleChange}
            placeholder="VD: 2024"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="category">Thể loại</label>
          <select
            id="category"
            name="category"
            value={searchParams.category}
            onChange={handleChange}
          >
            <option value="">-- Chọn thể loại --</option>
            <option value="action">Hành động</option>
            <option value="comedy">Hài</option>
            <option value="drama">Chính kịch</option>
            <option value="horror">Kinh dị</option>
            <option value="romance">Lãng mạn</option>
            <option value="sci-fi">Khoa học viễn tưởng</option>
          </select>
        </div>

        <div className="advanced-search__actions">
          <button type="submit" className="btn btn-primary">
            Tìm kiếm
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Đặt lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;
