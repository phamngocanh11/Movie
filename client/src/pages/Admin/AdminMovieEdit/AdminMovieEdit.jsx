import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import movieService from "../../../services/movieService";
import categoryService from "../../../services/categoryService";
import actorService from "../../../services/actorService";
import directorService from "../../../services/directorService";
import manufacturerService from "../../../services/manufacturerService";
import slugify from "slugify";
import { toast } from "sonner";
import { MdCancel, MdArrowBack } from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import "./AdminMovieEdit.css";

function AdminMovieEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch movie data
        const movieResponse = await movieService.getMovieById(id);
        if (!movieResponse || !movieResponse.data) {
          throw new Error("Không thể tải thông tin phim");
        }
        
        const movieData = movieResponse.data;
        setMovie(movieData);
        
        // Fetch related data
        const [categoriesRes, actorsRes, directorsRes, manufacturersRes] = await Promise.all([
          categoryService.getAllCategories(),
          actorService.getAllActors(),
          directorService.getAllDirectors(),
          manufacturerService.getAllManufacturers()
        ]);

        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setActors(Array.isArray(actorsRes.data) ? actorsRes.data : []);
        setDirectors(Array.isArray(directorsRes.data) ? directorsRes.data : []);
        setManufacturers(Array.isArray(manufacturersRes.data) ? manufacturersRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
        toast.error("Không thể tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNameChange = (name, setFieldValue) => {
    if (name) {
      const slug = slugify(name, {
        lower: true,
        locale: 'vi',
        remove: /[*+~.()'"!:@]/g
      });
      setFieldValue("slug", slug);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      const movieId = movie._id;
      const response = await movieService.updateMovie(movieId, formData);
      
      if (response && response.data) {
        toast.success("Cập nhật phim thành công!");
        navigate(`/admin/movies`);
      } else {
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error(
        error.message || "Có lỗi xảy ra khi cập nhật phim"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/movies/detail/${id}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const renderActions = () => (
    <>
      <Button 
        variant="secondary" 
        onClick={handleCancel}
        className="admin-movie-cancel-button"
        disabled={submitting}
      >
        <MdCancel /> Hủy
      </Button>
    </>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-detail-loading">
          <div className="admin-detail-loading-spinner"></div>
          <p>Đang tải thông tin phim...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !movie) {
    return (
      <AdminLayout>
        <div className="admin-detail-error">
          <div className="admin-detail-error-icon">!</div>
          <h3>Không thể tải thông tin phim</h3>
          <p>{error || "Đã xảy ra lỗi"}</p>
          <div className="error-actions">
            <Button 
              variant="primary"
              onClick={handleRetry}
            >
              Thử lại
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate("/admin/movies")}
            >
              <MdArrowBack /> Quay lại danh sách
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const movieFields = [
    {
      name: "name",
      label: "Tên phim",
      type: "text",
      required: true,
      placeholder: "Nhập tên phim",
      col: 6,
      value: movie.name || "",
      onChange: (e, setFieldValue) => handleNameChange(e.target.value, setFieldValue)
    },
    {
      name: "slug",
      label: "Đường dẫn (slug)",
      type: "text",
      required: true,
      placeholder: "ten-phim",
      col: 6,
      value: movie.slug || "",
    },
    {
      name: "content",
      label: "Nội dung phim",
      type: "textarea",
      required: true,
      placeholder: "Mô tả chi tiết về phim",
      col: 12,
      value: movie.content || "",
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      required: true,
      options: [
        { value: "released", label: "Đã phát hành" },
        { value: "upcoming", label: "Sắp ra mắt" },
        { value: "cancelled", label: "Đã hủy" },
      ],
      value: movie.status || "released",
      col: 6,
    },
    {
      name: "year",
      label: "Năm sản xuất",
      type: "number",
      placeholder: "2024",
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
      value: movie.year || new Date().getFullYear(),
      col: 6,
    },
    {
      name: "time",
      label: "Thời lượng",
      type: "text",
      placeholder: "120 phút",
      required: true,
      value: movie.time || "",
      col: 6,
    },
    {
      name: "quality",
      label: "Chất lượng",
      type: "select",
      required: true,
      options: [
        { value: "HD", label: "HD" },
        { value: "Full HD", label: "Full HD" },
        { value: "4K", label: "4K" },
      ],
      value: movie.quality || "Full HD",
      col: 6,
    },
    {
      name: "type",
      label: "Loại phim",
      type: "select",
      required: true,
      options: [
        { value: "movie", label: "Phim lẻ" },
        { value: "series", label: "Phim bộ" },
      ],
      value: movie.type || "movie",
      col: 6,
    },
    {
      name: "categories",
      label: "Thể loại",
      type: "multi-select",
      required: true,
      options: categories.map((cat) => ({ value: cat._id, label: cat.name })),
      value: movie.categories || [],
      col: 12,
    },
    {
      name: "actors",
      label: "Diễn viên",
      type: "multi-select",
      options: actors.map((actor) => ({ value: actor._id, label: actor.name })),
      value: movie.actors || [],
      col: 12,
    },
    {
      name: "director",
      label: "Đạo diễn",
      type: "multi-select",
      options: directors.map((dir) => ({ value: dir._id, label: dir.name })),
      value: movie.director || [],
      col: 12,
    },
    {
      name: "manufacturer",
      label: "Hãng sản xuất",
      type: "select",
      options: manufacturers.map((m) => ({ value: m._id, label: m.name })),
      value: movie.manufacturer || "",
      col: 6,
    },
    {
      name: "poster_url",
      label: "Poster phim",
      type: "file",
      required: true,
      value: movie.poster_url || "",
      accept: "image/*",
      col: 6,
      description: "Upload poster chính của phim",
      preview: movie.poster_url || "",
    },
    {
      name: "backdrop_url",
      label: "Backdrop phim",
      type: "file",
      value: movie.backdrop_url || "",
      accept: "image/*",
      col: 6,
      description: "Ảnh nền lớn dùng cho hero/detail",
      preview: movie.backdrop_url || "",
    },
    {
      name: "thumb_url",
      label: "Ảnh thumbnail",
      type: "file",
      value: movie.thumb_url || "",
      accept: "image/*",
      col: 6,
      description: "Ảnh thumbnail hiển thị ở trang chủ",
      preview: movie.thumb_url || "",
    },
    {
      name: "trailer_url",
      label: "Link trailer",
      type: "text",
      placeholder: "https://youtube.com/...",
      value: movie.trailer_url || "",
      col: 12,
    },
    {
      name: "source_url",
      label: "Link nguồn phim",
      type: "textarea",
      placeholder: "Server 1|https://...m3u8\nServer 2|https://...m3u8",
      required: true,
      value: movie.source_url || "",
      col: 12,
      description: "Mỗi dòng là một server. Định dạng: Tên server|URL",
    },
    {
      name: "subtitle_tracks",
      label: "Phụ đề",
      type: "textarea",
      placeholder: "Vietnamese|https://...vtt|vi|default",
      value: movie.subtitle_tracks || "",
      col: 12,
      description: "Mỗi dòng là một track. Định dạng: Tên|URL|lang|default",
    },
    {
      name: "next_episode_slug",
      label: "Tập tiếp theo (slug)",
      type: "text",
      placeholder: "interstellar-episode-2",
      value: movie.next_episode_slug || "",
      col: 12,
      description: "Bỏ trống nếu đây là phim lẻ",
    },
  ];

  return (
    <AdminLayout>
      <AdminAddHeader
        title="Chỉnh sửa phim"
        subtitle={`Đang chỉnh sửa thông tin phim ${movie.name}`}
        actions={renderActions()}
      />

      <div className="admin-movie-edit-container">
        <div className="admin-movie-edit-form-card">
          <AdminAddForm
            id="edit-movie-form"
            fields={movieFields}
            onSubmit={handleSubmit}
            showSubmitButton={true}
            submitButtonText={submitting ? "Đang lưu..." : "Lưu thay đổi"} 
            submitButtonDisabled={submitting}
            resetAfterSubmit={false}
            className="admin-movie-edit-form"
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminMovieEdit; 
