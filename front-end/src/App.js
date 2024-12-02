import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RTLProvider from "./ThemeProvider";
import HomePage from "./components/User/HomePage";
import LoginPage from "./components/Login";
import UserProfilePage from "./components/User/profile";
import UserEditProfile from "./components/User/EditProfile";
import RestaurantEditProfile from "./components/Restaurant/EditProfile";
import Header from "./components/User/Header";
import UserSignUp from "./components/User/SignUp";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import UserProvider from "./components/User/UserContext"; 
import FoodItemPage from "./components/User/MenuItem";
import "./App.css";


function App() {function isAuthenticated() {
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

							{/* <Route
              path="/profile"
              element={isAuthenticated() ? <UserProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/edit-profile"
              element={isAuthenticated() ? <EditProfilePage /> : <Navigate to="/login" />}
            /> */}

							<Route path="/login" element={<LoginPage />} />
							<Route path="/user-signup" element={<UserSignUp />} />
							<Route path="/menu-item" element={<FoodItemPage />} />
							<Route path="/restuarant-signup" element={<RestaurantSignUp />} />
<<<<<<< HEAD
							{/* <Route path="/restaurant/:id/profile" element={<RestaurantEditProfile />} /> */}
=======
>>>>>>> 796f094 (package bug fixes)
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
									isAuthenticated() ? <UserEditProfile /> : <Navigate to="/login" />
<<<<<<< HEAD
=======
								}
							/>
							<Route
								path="/restaurant-edit-profile"
								element={
									isAuthenticated() ? <RestaurantEditProfile /> : <Navigate to="/login" />
>>>>>>> 796f094 (package bug fixes)
								}
							/>
							<Route
  								path="/restaurant/:id/profile"
  								element={
    							isAuthenticated() ? (	<RestaurantEditProfile />
    							) : (<Navigate to="/login" replace />)
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
