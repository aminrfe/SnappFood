import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../utills/axiosInstance";
import { Navigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    if (!accessToken || !refreshToken) {
      console.warn("Access or Refresh token is missing");
      setUser(null);
      return;
    }

    try {
      const resID = localStorage.getItem("res_id");
      if (!resID || resID === "undefined") {
        const response = await axiosInstance.get("/customer/profile");
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error("خطا در دریافت پروفایل:", error);

      if (error.response && error.response.status === 401) {
        console.warn("توکن منقضی شده است. کاربر باید دوباره وارد شود.");
        localStorage.clear();
        setUser(null);
        Navigate("/login");
      }
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

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
