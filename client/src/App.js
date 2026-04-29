import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Home from "./pages/Home/Home";
import { Toaster } from "sonner";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminMovies from "./pages/Admin/AdminMovies/AdminMovies";
import AdminAddMovie from "./pages/Admin/AdminAddMovie/AdminAddMovie";
import AdminMovieDetail from "./pages/Admin/AdminMovieDetail/AdminMovieDetail";
import AdminUser from "./pages/Admin/AdminUsers/AdminUser";
import AdminAddUser from "./pages/Admin/AdminAddUser/AdminAddUser";
import AdminCategory from "./pages/Admin/AdminCategory/AdminCategory";
import AdminManufacturer from "./pages/Admin/AdminManufacturers/AdminManufacturer";
import AdminDirector from "./pages/Admin/AdminDirectors/AdminDirector";
import AdminActor from "./pages/Admin/AdminActors/AdminActor";
import AdminUserDetail from "./pages/Admin/AdminUserDetail/AdminUserDetail";
import AdminEditUser from "./pages/Admin/AdminEditUser/AdminEditUser";
import AdminAddCategory from "./pages/Admin/AdminAddCategory/AdminAddCategory";
import AdminCategoryDetail from "./pages/Admin/AdminCategoryDetail/AdminCategoryDetail";
import AdminEditCategory from "./pages/Admin/AdminEditCategory/AdminEditCategory";
import AdminAddManufacturer from "./pages/Admin/AdminAddManufacturer/AdminAddManufacturer";
import AdminEditManufacturer from "./pages/Admin/AdminEditManufacturer/AdminEditManufacturer";
import AdminManufacturerDetail from "./pages/Admin/AdminManufacturerDetail/AdminManufacturerDetail";
import AdminActorDetail from "./pages/Admin/AdminActorDetail/AdminActorDetail";
import AdminAddActor from "./pages/Admin/AdminAddActor/AdminAddActor";
import AdminEditActor from "./pages/Admin/AdminEditActor/AdminEditActor";
import AdminAddDirector from "./pages/Admin/AdminAddDirector/AdminAddDirector";
import AdminEditDirector from "./pages/Admin/AdminEditDirector/AdminEditDirector";
import AdminDirectorDetail from "./pages/Admin/AdminDirectorDetail/AdminDirectorDetail";
import AdminMovieEdit from "./pages/Admin/AdminMovieEdit/AdminMovieEdit";
import Profile from "./pages/Profile/Profile";
import MoviesPage from "./pages/MoviePage/MoviesPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import { FavoriteProvider } from "./contexts/FavoriteContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import MoviePlayer from "./pages/MoviePlayer/MoviePlayer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

function App() {
  return (
    <ThemeProvider>
      <FavoriteProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/movies" element={<AdminMovies />} />
              <Route path="/admin/movies/add" element={<AdminAddMovie />} />
              <Route path="/admin/movies/:id" element={<AdminMovieDetail />} />
              <Route path="/admin/movies/edit/:id" element={<AdminMovieEdit />} />
              <Route path="/admin/users" element={<AdminUser />} />
              <Route path="/admin/users/add" element={<AdminAddUser />} />
              <Route path="/admin/users/:id" element={<AdminUserDetail />} />
              <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
              <Route path="/admin/categories" element={<AdminCategory />} />
              <Route
                path="/admin/categories/add"
                element={<AdminAddCategory />}
              />
              <Route
                path="/admin/categories/:id"
                element={<AdminCategoryDetail />}
              />
              <Route
                path="/admin/categories/edit/:id"
                element={<AdminEditCategory />}
              />
              <Route
                path="/admin/manufacturers"
                element={<AdminManufacturer />}
              />
              <Route
                path="/admin/manufacturers/add"
                element={<AdminAddManufacturer />}
              />
              <Route
                path="/admin/manufacturers/:id"
                element={<AdminManufacturerDetail />}
              />
              <Route
                path="/admin/manufacturers/edit/:id"
                element={<AdminEditManufacturer />}
              />
              <Route path="/admin/directors" element={<AdminDirector />} />
              <Route path="/admin/directors/add" element={<AdminAddDirector />} />
              <Route
                path="/admin/directors/:id"
                element={<AdminDirectorDetail />}
              />
              <Route
                path="/admin/directors/edit/:id"
                element={<AdminEditDirector />}
              />
              <Route path="/admin/actors" element={<AdminActor />} />
              <Route path="/admin/actors/add" element={<AdminAddActor />} />
              <Route path="/admin/actors/:id" element={<AdminActorDetail />} />
              <Route path="/admin/actors/edit/:id" element={<AdminEditActor />} />
            </Route>

            <Route path="/profile" element={<Profile />} />

            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/movie/:slug" element={<MovieDetail />} />
            <Route path="/watch/:slug" element={<MoviePlayer />} />

            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
          <div className="toaster">
            <Toaster position="top-right" richColors />
          </div>
        </BrowserRouter>
      </FavoriteProvider>
    </ThemeProvider>
  );
}

export default App;
