import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// ایجاد کانتکست
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // گرفتن اطلاعات کاربر از سرور
  const fetchUser = async () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/token", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات کاربر:", error);
      // اگر توکن معتبر نباشد، کاربر از سیستم خارج شود
      // localStorage.removeItem("access");
      // localStorage.removeItem("refresh");
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
