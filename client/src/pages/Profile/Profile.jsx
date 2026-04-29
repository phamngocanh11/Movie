import React, { useState, useEffect, useRef } from "react";
import {
  getUserSingleInfo,
  isAuthenticated,
  encryptedUserData,
} from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import UserLayout from "../../layouts/UserLayout/UserLayout";

import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs/ProfileTabs";
import ProfileInfo from "../../components/Profile/ProfileInfo/ProfileInfo";
import PasswordChange from "../../components/Profile/PasswordChange/PasswordChange";
import FavoriteMovies from "../../components/Profile/FavouriteMovies/FavoriteMovies";
import WatchHistory from "../../components/Profile/WatchHistory/WatchHistory";
import userService from "../../services/userService";
import movieService from "../../services/movieService";

import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated()) {
      const userId = getUserSingleInfo("_id");
      fetchUserAndMovies(userId);
    } else {
      navigate("/login");
    }

    window.scrollTo(0, 0);
  }, [navigate]);

  const fetchUserAndMovies = async (userId) => {
    setLoading(true);
    try {
      const userResponse = await userService.getUserById(userId);
      if (userResponse) {
        const userData = userResponse;
        setUser(userData);
        setFormData({
          name: userData.name || userData.fullName || "",
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });

        try {
          const favoritesResponse = await userService.getUserFavorites(userId);

          if (
            favoritesResponse &&
            favoritesResponse.success &&
            Array.isArray(favoritesResponse.data)
          ) {
            setFavorites(favoritesResponse.data);
          } else if (userData.favourite && userData.favourite.length > 0) {
            const favoriteMoviesData = [];
            for (const movieId of userData.favourite) {
              const movieResponse = await movieService.getMovieById(movieId);
              if (movieResponse && movieResponse.data) {
                favoriteMoviesData.push(movieResponse.data);
              }
            }
            setFavorites(favoriteMoviesData);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          toast.error("Không thể tải phim yêu thích");

          // Fallback if API call fails
          if (userData.favourite && userData.favourite.length > 0) {
            try {
              const favoriteMoviesData = [];
              for (const movieId of userData.favourite) {
                const movieResponse = await movieService.getMovieById(movieId);
                if (movieResponse && movieResponse.data) {
                  favoriteMoviesData.push(movieResponse.data);
                }
              }
              setFavorites(favoriteMoviesData);
            } catch (err) {
              console.error("Fallback favorites fetch failed:", err);
            }
          }
        }

        if (userData.movieWatched && userData.movieWatched.length > 0) {
          try {
            const historyData = [];
            for (const movieId of userData.movieWatched) {
              const movieResponse = await movieService.getMovieById(movieId);

              if (movieResponse && movieResponse.data) {
                const watchHistoryResponse = await userService.getWatchHistory(
                  userId,
                  movieId
                );

                const progress =
                  watchHistoryResponse && watchHistoryResponse.found
                    ? watchHistoryResponse.data.percentWatched || 0
                    : 0;

                const lastWatchedDate =
                  watchHistoryResponse &&
                  watchHistoryResponse.found &&
                  watchHistoryResponse.data.updatedAt
                    ? new Date(watchHistoryResponse.data.updatedAt)
                    : new Date();

                historyData.push({
                  ...movieResponse.data,
                  progress: progress,
                  lastWatched: lastWatchedDate.toLocaleDateString("vi-VN"),
                });
              }
            }
            setWatchHistory(historyData);
          } catch (error) {
            toast.error("Không thể tải lịch sử xem phim");
          }
        }
      }
    } catch (error) {
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => setEditing(true);

  const handleCancelEdit = () => {
    setEditing(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData({
      name: user.name || user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const userId = getUserSingleInfo("_id");

        const updateData = new FormData();
        updateData.append("name", formData.name);
        updateData.append("email", formData.email);

        if (selectedFile) {
          updateData.append("avatar", selectedFile);
        }

        const response = await userService.updateUser(userId, updateData);

        if (response) {
          const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
          };

          if (response.avatar) {
            updatedUser.avatar = response.avatar;
          }

          setUser(updatedUser);

          encryptedUserData(updatedUser);

          setEditing(false);
          setPreviewImage(null);
          setSelectedFile(null);
          window.location.reload();
        }
      } catch (error) {
        toast.error(
          "Cập nhật thông tin thất bại: " + (error.message || "Đã xảy ra lỗi")
        );
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      try {
        const userId = getUserSingleInfo("_id");

        await userService.changePassword(userId, passwordForm.newPassword);

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success("Mật khẩu đã được thay đổi thành công!");
      } catch (error) {
        toast.error(
          "Đổi mật khẩu thất bại: " + (error.message || "Đã xảy ra lỗi")
        );
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Tên không được để trống";
    if (!formData.email) newErrors.email = "Email không được để trống";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Mật khẩu hiện tại không được để trống";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Mật khẩu mới không được để trống";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <UserLayout>
      <div className="user-profile-container">
        <div className="user-profile-glass">
          <ProfileHeader
            user={user}
            editing={editing}
            previewImage={previewImage}
            handleImageClick={handleImageClick}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
          />
        </div>

        <div className="user-profile-body">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="user-profile-content user-profile-glass">
            <div className="user-profile-tab-content">
              {activeTab === "profile" && (
                <ProfileInfo
                  user={user}
                  editing={editing}
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  handleEditClick={handleEditClick}
                  handleCancelEdit={handleCancelEdit}
                  loading={loading}
                />
              )}

              {activeTab === "password" && (
                <PasswordChange
                  passwordForm={passwordForm}
                  passwordErrors={passwordErrors}
                  handlePasswordChange={handlePasswordChange}
                  handlePasswordSubmit={handlePasswordSubmit}
                />
              )}

              {activeTab === "favorites" && (
                <FavoriteMovies favorites={favorites} loading={loading} />
              )}

              {activeTab === "history" && (
                <WatchHistory watchHistory={watchHistory} loading={loading} />
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Profile;
