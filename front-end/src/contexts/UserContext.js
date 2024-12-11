import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utills/axiosInstance";

// ایجاد کانتکست
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // گرفتن اطلاعات کاربر از سرور
  const fetchUser = async () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    if (!accessToken || !refreshToken) {
      console.error("Access or Refresh token is missing");
      return;
    }

    try {
      const response = await axiosInstance.get("/customer/profile");
      // console.log("پروفایل کاربر:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      console.error("خطا در دریافت پروفایل:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
