import CryptoJS from "crypto-js";
const secretKey = process.env.REACT_APP_SECRET_KEY || "secretKeyExample";

const clearInvalidData = () => {
  localStorage.removeItem("userData");
};

export const isAuthenticated = () => {
  try {
    const encryptedData = localStorage.getItem("userData");
    if (!encryptedData) return false;

    const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    if (!decrypted) {
      clearInvalidData();
      return false;
    }

    const parsed = JSON.parse(decrypted);
    if (!parsed || typeof parsed !== "object") {
      clearInvalidData();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    clearInvalidData();
    return false;
  }
};

export const encryptedUserData = (data) => {
  try {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid user data");
    }

    const userData = {
      _id: data._id,
      name: data.name || "User",
      username: data.username,
      email: data.email,
      role: data.role || "user",
      avatar: data.avatar || "",
      movieWatched: data.movieWatched || [],
      favourite: data.favourite || [],
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(userData),
      secretKey
    ).toString();

    localStorage.setItem("userData", encryptedData);
    return true;
  } catch (error) {
    console.error("Error encrypting user data:", error);
    clearInvalidData();
    return false;
  }
};

export const decryptedUserData = () => {
  try {
    const encryptedData = localStorage.getItem("userData");
    if (!encryptedData) return null;

    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      clearInvalidData();
      return null;
    }

    const parsedData = JSON.parse(decryptedData);
    if (!parsedData || typeof parsedData !== "object") {
      clearInvalidData();
      return null;
    }

    return parsedData;
  } catch (error) {
    console.error("Error decrypting user data:", error);
    clearInvalidData();
    return null;
  }
};

export const getUserSingleInfo = (info) => {
  try {
    const userData = decryptedUserData();
    if (!userData) return null;
    return userData[info] || null;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

export const logout = () => {
  clearInvalidData();
  window.location.href = "/login";
};

export const getRoleAfterLogin = (response) => {
  const role = response.role;
  if (role === "admin") {
    return "/admin/dashboard";
  } else {
    return "/";
  }
};
