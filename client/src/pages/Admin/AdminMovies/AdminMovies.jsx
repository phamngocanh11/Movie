import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminListHeader from "../../../components/Admin/AdminListHeader/AdminListHeader";
import { useNavigate } from "react-router-dom";
import AdminListFilter from "../../../components/Admin/AdminListFilter/AdminListFilter";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import movieService from "../../../services/movieService";
import categoryService from "../../../services/categoryService";
import { toast } from "sonner";
import { MdLocalMovies } from "react-icons/md";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import "./AdminMovies.css";

function AdminMovies() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [moviesResponse, categoriesResponse] = await Promise.all([
        movieService.getAllMovies(),
        categoryService.getAllCategories()
      ]);
      
      if (moviesResponse && Array.isArray(moviesResponse.data)) {
        setMovies(moviesResponse.data);
      } else {
        console.warn("Movies response không đúng định dạng:", moviesResponse);
        setMovies([]);
      }
      
      if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      } else {
        console.warn("Categories response không đúng định dạng:", categoriesResponse);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      toast.error("Không thể tải dữ liệu phim");
    } finally {
      setLoading(false);
    }
  };

  const getStatusOptions = () => [
    { value: "", label: "Tất cả" },
    { value: "released", label: "Đã phát hành" },
    { value: "upcoming", label: "Sắp ra mắt" },
    { value: "cancelled", label: "Đã hủy" }
  ];
  
  const getCategoryOptions = () => {
    const options = [{ value: "", label: "Tất cả" }];
    
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        options.push({
          value: category._id,
          label: category.name
        });
      });
    }
    
    return options;
  };
  
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [{ value: "", label: "Tất cả" }];
    
    const decades = [
      { value: "2020s", start: 2020, end: currentYear },
      { value: "2010s", start: 2010, end: 2019 },
      { value: "2000s", start: 2000, end: 2009 },
      { value: "1990s", start: 1990, end: 1999 },
      { value: "before_1990", start: 0, end: 1989 }
    ];
    
    for (let year = currentYear; year >= 2020; year--) {
      options.push({
        value: year.toString(),
        label: year.toString()
      });
    }
    
    decades.forEach(decade => {
      if (decade.value === "2020s") return; 
      
      if (decade.value === "before_1990") {
        options.push({
          value: decade.value,
          label: "Trước 1990"
        });
      } else {
        options.push({
          value: decade.value,
          label: `${decade.start}-${decade.end}`
        });
      }
    });
    
    return options;
  };

  const filters = [
    {
      id: "status",
      label: "Trạng thái",
      type: "select",
      value: statusFilter,
      options: getStatusOptions()
    },
    {
      id: "year",
      label: "Năm sản xuất",
      type: "select",
      value: yearFilter,
      options: getYearOptions()
    },
    {
      id: "category",
      label: "Thể loại",
      type: "select",
      value: categoryFilter,
      options: getCategoryOptions()
    }
  ];

  const handleFilterChange = (filterId, value) => {
    switch (filterId) {
      case "status":
        setStatusFilter(value);
        break;
      case "year":
        setYearFilter(value);
        break;
      case "category":
        setCategoryFilter(value);
        break;
      default:
        break;
    }
  };

  const getFilteredMovies = () => {
    let filtered = [...movies];
    
    if (searchValue) {
      const searchTerm = searchValue.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.name.toLowerCase().includes(searchTerm)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(movie => movie.status === statusFilter);
    }
    
    if (yearFilter) {
      if (yearFilter.includes('s')) {
        if (yearFilter === "2010s") {
          filtered = filtered.filter(movie => movie.year >= 2010 && movie.year <= 2019);
        } else if (yearFilter === "2000s") {
          filtered = filtered.filter(movie => movie.year >= 2000 && movie.year <= 2009);
        } else if (yearFilter === "1990s") {
          filtered = filtered.filter(movie => movie.year >= 1990 && movie.year <= 1999);
        } else if (yearFilter === "before_1990") {
          filtered = filtered.filter(movie => movie.year < 1990);
        }
      } else {
        filtered = filtered.filter(movie => movie.year === parseInt(yearFilter));
      }
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(movie => 
        movie.categories && movie.categories.some(cat => 
          (typeof cat === 'string' ? cat : cat._id) === categoryFilter
        )
      );
    }
    
    return filtered;
  };
  
  const filteredMovies = getFilteredMovies();
  const totalItems = filteredMovies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMovies.slice(startIndex, endIndex);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    { 
      key: "title", 
      title: "Tên phim",
      render: (movie) => (
        <div className="admin-movies__title-cell">
          <div className="admin-movies__poster">
            <img 
              src={movie.poster_url} 
              alt={movie.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40x60?text=Error";
              }}
            />
          </div>
          <div className="admin-movies__info">
            <div className="admin-movies__name">{movie.name}</div>
          </div>
        </div>
      )
    },
    { 
      key: "quality", 
      title: "Chất lượng",
      render: (movie) => (
        <span className={`admin-movies__quality admin-movies__quality--${movie.quality?.toLowerCase().replace(/\s+/g, '')}`}>
          {movie.quality || "N/A"}
        </span>
      )
    },
    { 
      key: "views", 
      title: "Lượt xem",
      render: (movie) => (
        <span className="admin-movies__views">
          {movie.views ? new Intl.NumberFormat().format(movie.views) : "0"}
        </span>
      )
    },
    { 
      key: "year", 
      title: "Năm sản xuất", 
      render: (movie) => movie.year || "N/A" 
    },
    { 
      key: "status", 
      title: "Trạng thái",
      render: (movie) => {
        let statusText = "Không xác định";
        let className = "admin-movies__status--unknown";
        
        switch (movie.status) {
          case "released":
            statusText = "Đã phát hành";
            className = "admin-movies__status--released";
            break;
          case "upcoming":
            statusText = "Sắp ra mắt";
            className = "admin-movies__status--upcoming";
            break;
          case "cancelled":
            statusText = "Đã hủy";
            className = "admin-movies__status--cancelled";
            break;
          default:
            break;
        }
        
        return <span className={`admin-movies__status ${className}`}>{statusText}</span>;
      }
    },
    {
      key: "actions",
      title: "Hành động",
    },
  ];

  const handleViewMovie = (id) => {
    navigate(`/admin/movies/${id}`);
  };

  const handleEditMovie = (id) => {
    navigate(`/admin/movies/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setMovieToDelete(id);
    setDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setMovieToDelete(null);
  };
  
  const confirmDelete = async () => {
    if (!movieToDelete) return;
    
    try {
      await movieService.deleteMovie(movieToDelete);
      setMovies(movies.filter(movie => movie._id !== movieToDelete));
      toast.success("Xóa phim thành công!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Xóa phim thất bại: " + (error.message || "Đã xảy ra lỗi"));
    }
  };

  const emptyStateProps = {
    icon: <MdLocalMovies size={48} />,
    title: "Không có phim nào",
    message: "Hãy thêm phim đầu tiên của bạn",
  };

  return (
    <AdminLayout>
      <AdminListHeader
        title="Quản lý phim"
        subtitle="Quản lý phim trong hệ thống của bạn"
        actionButton={() => navigate("/admin/movies/add")}
        titleButton="Thêm phim mới"
      />

      <AdminListFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Tìm kiếm phim..."
      />

      <AdminDataTable
        data={getCurrentPageData()}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchData}
        emptyStateProps={emptyStateProps}
        onView={handleViewMovie}
        onEdit={handleEditMovie}
        onDelete={handleDeleteClick}
        pagination={{
          currentPage,
          totalPages,
          startItem: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
          endItem: Math.min(currentPage * itemsPerPage, totalItems),
          totalItems
        }}
        onPageChange={handlePageChange}
      />
      
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Xác nhận xóa phim"
        message="Bạn có chắc chắn muốn xóa phim này? Tất cả dữ liệu liên quan đến phim này (bình luận, lượt xem, đánh giá) sẽ bị xóa. Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminMovies;
