import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RTLProvider from "./ThemeProvider";
import HomePage from "./components/User/HomePage";
import LoginPage from "./components/Login";
import UserProfilePage from "./components/User/profile";
import EditProfile from "./components/User/EditProfile";
import Header from "./components/User/Header";
import UserSignUp from "./components/User/SignUp";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import UserProvider from "./components/User/UserContext";
import FoodItemPage from "./components/User/MenuItem";
import FavoritesPage from "./components/User/FavoritesPage.js";

import "./App.css";

function App() {
  function isAuthenticated() {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    return Boolean(accessToken && refreshToken); // Return true if tokens exist
  }

  return (
    <div className="app-container">
      <RTLProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header isAuthenticated={isAuthenticated} />
                    <HomePage isAuthenticated={isAuthenticated} />
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/userSignUp" element={<UserSignUp />} />
              <Route path="/menu-item" element={<FoodItemPage />} />
              <Route path="/restaurantSignUp" element={<RestaurantSignUp />} />
              <Route
                path="/profile"
                element={
                  isAuthenticated() ? (
                    <UserProfilePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/edit-profile"
                element={
                  isAuthenticated() ? <EditProfile /> : <Navigate to="/login" />
                }
              />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </Router>
        </UserProvider>
      </RTLProvider>
    </div>
  );
}

export default App;
