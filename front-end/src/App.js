import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import UserSignUp from "./components/User/SignUp";
import HomePage from "./components/User/HomePage";
import Header from "./components/User/Header";
import RTLProvider from "./ThemeProvider";
import Login from "./components/Login";
import "./App.css";

function App() {
	return (
		<Router>
			<div className="app-container">
				<Routes>
					<Route
						path="/"
						element={
							<>
								<RTLProvider>
									<Header />
									<HomePage />
								</RTLProvider>
							</>
						}
					/>
					<Route
						path="/login"
						element={
							<RTLProvider>
								<Login />
							</RTLProvider>
						}
					/>
					<Route
						path="/user-signup"
						element={
							<RTLProvider>
								<UserSignUp />
							</RTLProvider>
						}
					/>
					<Route
						path="/restaurant-signup"
						element={
							<RTLProvider>
								<RestaurantSignUp />
							</RTLProvider>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
