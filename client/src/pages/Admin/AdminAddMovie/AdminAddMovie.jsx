import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import categoryService from "../../../services/categoryService";
import actorService from "../../../services/actorService";
import directorService from "../../../services/directorService";
import manufacturerService from "../../../services/manufacturerService";
import movieService from "../../../services/movieService";
import slugify from "slugify";
import { toast } from "sonner";
import "./AdminAddMovie.css";

function AdminAddMovie() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        console.error("Failed to fetch data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        toast.error("Không thể tải dữ liệu cần thiết");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const movieFields = [
    {
      name: "name",
      label: "Tên phim",
      type: "text",
      required: true,
      placeholder: "Nhập tên phim",
      col: 6,
      onChange: (e, setFieldValue) => handleNameChange(e.target.value, setFieldValue)
    },
    {
      name: "slug",
      label: "Đường dẫn (slug)",
      type: "text",
      required: true,
      placeholder: "ten-phim",
      col: 6,
    },
    {
      name: "content",
      label: "Nội dung phim",
      type: "textarea",
      required: true,
      placeholder: "Mô tả chi tiết về phim",
      col: 12,
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
      defaultValue: "released",
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
      defaultValue: new Date().getFullYear(),
      col: 6,
    },
    {
      name: "time",
      label: "Thời lượng",
      type: "text",
      placeholder: "120 phút",
      required: true,
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
      defaultValue: "Full HD",
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
      defaultValue: "movie",
      col: 6,
    },
    {
      name: "categories",
      label: "Thể loại",
      type: "multi-select",
      required: true,
      options: categories.map((cat) => ({ value: cat._id, label: cat.name })),
      col: 12,
    },
    {
      name: "actors",
      label: "Diễn viên",
      type: "multi-select",
      options: actors.map((actor) => ({ value: actor._id, label: actor.name })),
      col: 12,
    },
    {
      name: "director",
      label: "Đạo diễn",
      type: "multi-select",
      options: directors.map((dir) => ({ value: dir._id, label: dir.name })),
      col: 12,
    },
    {
      name: "manufacturer",
      label: "Hãng sản xuất",
      type: "select",
      options: manufacturers.map((m) => ({ value: m._id, label: m.name })),
      col: 6,
    },
    {
      name: "poster_url",
      label: "Poster phim",
      type: "file",
      required: true,
      accept: "image/*",
      col: 6,
      description: "Upload poster chính của phim",
    },
    {
      name: "backdrop_url",
      label: "Backdrop phim",
      type: "file",
      accept: "image/*",
      col: 6,
      description: "Ảnh nền lớn dùng cho hero/detail",
    },
    {
      name: "thumb_url",
      label: "Ảnh thumbnail",
      type: "file",
      accept: "image/*",
      col: 6,
      description: "Ảnh thumbnail hiển thị ở trang chủ",
    },
    {
      name: "trailer_url",
      label: "Link trailer",
      type: "text",
      placeholder: "https://youtube.com/...",
      col: 12,
    },
    {
      name: "source_url",
      label: "Link nguồn phim",
      type: "textarea",
      placeholder: "Server 1|https://...m3u8\nServer 2|https://...m3u8",
      required: true,
      col: 12,
      description: "Mỗi dòng là một server. Định dạng: Tên server|URL",
    },
    {
      name: "subtitle_tracks",
      label: "Phụ đề",
      type: "textarea",
      placeholder: "Vietnamese|https://...vtt|vi|default",
      col: 12,
      description: "Mỗi dòng là một track. Định dạng: Tên|URL|lang|default",
    },
    {
      name: "next_episode_slug",
      label: "Tập tiếp theo (slug)",
      type: "text",
      placeholder: "interstellar-episode-2",
      col: 12,
      description: "Bỏ trống nếu đây là phim lẻ",
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      const processedData = { ...formData };
      
      console.log("Form data trước khi xử lý:", formData);
      
      const requiredFields = movieFields
        .filter(field => field.required)
        .map(field => field.name);
        
      for (const field of requiredFields) {
        if (!processedData[field] || 
           (Array.isArray(processedData[field]) && processedData[field].length === 0)) {
          toast.error(`Vui lòng điền đầy đủ thông tin trường ${
            movieFields.find(f => f.name === field)?.label || field
          }`);
          setSubmitting(false);
          return;
        }
      }
      
      const response = await movieService.createMovie(processedData);
      
      if (response && response.data) {
        toast.success("Thêm phim mới thành công!");
        navigate("/admin/movies");
      } else {
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm phim!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/movies");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-error">
          <div className="admin-error-icon">!</div>
          <h3>Không thể tải dữ liệu</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Thử lại
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminAddHeader 
        title="Thêm phim mới" 
        subtitle="Điền thông tin để thêm phim mới vào cơ sở dữ liệu"
      />
      <div className="admin-add-movie-container">
        <AdminAddForm
          fields={movieFields}
          onSubmit={handleSubmit}
          submitButtonText={submitting ? "Đang thêm..." : "Thêm phim"}
          submitButtonDisabled={submitting}
          cancelButton={true}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminAddMovie;
