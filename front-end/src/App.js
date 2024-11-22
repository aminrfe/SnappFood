import React, { useState } from "react";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import UserSignUp from "./components/User/SignUp";
import RTLProvider from "./ThemeProvider";
import Login from "./components/Login";
import "./App.css";

function App() {
	const [isLoginPage, setIsLoginPage] = useState(true);
	const [isRestaurantSignUp, setIsRestaurantSignUp] = useState(false);

	const switchToRestaurantSignUp = () => {
		setIsLoginPage(false);
		setIsRestaurantSignUp(true);
	};

	const switchToUserSignUp = () => {
		setIsLoginPage(false);
		setIsRestaurantSignUp(false);
	};

	return (
		<div className="app-container">
			{isLoginPage ? (
				<RTLProvider>
					<Login
						onUserSignUp={switchToUserSignUp}
						onRestaurantSignUp={switchToRestaurantSignUp}
					/>
				</RTLProvider>
			) : isRestaurantSignUp ? (
				<RTLProvider>
					<RestaurantSignUp onUserSignUp={() => setIsLoginPage(true)} />
				</RTLProvider>
			) : (
				<RTLProvider>
					<UserSignUp onUserSignUp={() => setIsLoginPage(true)} />
				</RTLProvider>
			)}
		</div>
	);
}

export default App;
