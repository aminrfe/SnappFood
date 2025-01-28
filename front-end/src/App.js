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
import RestaurantOrderList from "./components/Restaurant/Orders.js";
import RestaurantReportPage from "./components/Restaurant/ReportPage.js";
import CartPage from "./components/User/CartPage.js";
import CartCompletion from "./components/User/CartCompletion.js";
import CartsList from "./components/User/CartsList";
import TrackOrderPage from "./components/User/TrackOrder.js";
import ReviewPage from "./components/User/ReviewPage";
import CheckoutPage from "./components/User/Checkout.js";
import MyOrders from "./components/User/MyOrders"; 


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
                    <Header isAuthenticated={isAuthenticated} />
                    <HomePage isAuthenticated={isAuthenticated} />
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/customer/signup" element={<UserSignUp />} />
              <Route
                path="/customer/restaurants/:id/:item_id"
                element={<FoodItemPage />}
              />
              <Route path="/restuarant/signup" element={<RestaurantSignUp />} />
              <Route path="/customer/restaurants/:id" element={<RestaurantPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="customer/favorites"
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
                path="/customer/edit-profile"
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
              <Route
                path="/restaurant/:id/report"
                element={
                  isAuthenticated() ? (
                    <RestaurantReportPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/customer/carts"
                element={
                  isAuthenticated() ? <CartPage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/customer/carts/:id/cart-completion"
                element={
                  isAuthenticated() ? (
                    <CartCompletion />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/customer/carts/:id/checkout"
                element={
                  isAuthenticated() ? (
                    <CheckoutPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/restaurant/:id/orders"
                element={
                  isAuthenticated() ? (
                    <RestaurantOrderList />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/customer/cart-list"
                element={
                  isAuthenticated() ? (
                    <CartsList />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/customer/orders/:id/track-order"
                element={
                  isAuthenticated() ? (
                    <TrackOrderPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="customer/orders/:id/review"
                element={
                  isAuthenticated() ? <ReviewPage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/customer/orders"
                element={
                  isAuthenticated() ? <MyOrders /> : <Navigate to="/login" replace />
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
