import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RTLProvider from "./ThemeProvider";
import HomePage from "./components/User/HomePage";
import LoginPage from "./components/Login";
import UserProfilePage from "./components/User/profile";
import UserEditProfile from "./components/User/EditProfile";
import RestaurantEditProfile from "./components/Restaurant/EditProfile";
import Header from "./components/User/Header";
import UserSignUp from "./components/User/SignUp";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import CustomerProfile from "./components/User/profile";
import RestaurantProfile from "./components/Restaurant/Profile";
import UserProvider from "./contexts/UserContext";
import FoodItemPage from "./components/User/MenuItem";
import "./App.css";
import RestaurantPage from "./components/User/RestaurantPage";
import EditMenu from "./components/Restaurant/EditMenu";
import FavoritesPage from "./components/User/FavoritesPage.js";
import SearchPage from "./components/User/SearchPage.js";
import OrderList from "./components/Restaurant/Orders.js";

function App() {
  function isAuthenticated() {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    return !!(accessToken && refreshToken);
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
                    <OrderList />
                    {/* <Header isAuthenticated={isAuthenticated} />
                    <HomePage isAuthenticated={isAuthenticated} /> */}
                  </>
                }
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/user-signup" element={<UserSignUp />} />
              <Route path="/menu-item" element={<FoodItemPage />} />
              <Route path="/restuarant-signup" element={<RestaurantSignUp />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/orders" element={<OrderList />} />
              {/* <Route path="/restaurant/:res_id/menu" element={<EditMenu />} /> */}
              {/* <Route path="/favorites" element={<FavoritesPage />} /> */}
              {/* <Route path="/restaurant/:id/profile" element={<RestaurantEditProfile />} /> */}
              <Route
                path="/favorites"
                element={
                  isAuthenticated() ? (
                    <FavoritesPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/restaurant/:res_id/menu"
                element={
                  isAuthenticated() ? <EditMenu /> : <Navigate to="/login" />
                }
              />
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
                path="/user-edit-profile"
                element={
                  isAuthenticated() ? (
                    <UserEditProfile />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/restaurant/:id/profileEdit"
                element={
                  isAuthenticated() ? (
                    <RestaurantEditProfile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/restaurant/:id/profile"
                element={
                  isAuthenticated() ? (
                    <RestaurantProfile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/customer/profile"
                element={
                  isAuthenticated() ? (
                    <CustomerProfile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </Router>
        </UserProvider>
      </RTLProvider>
    </div>
  );
}

export default App;
