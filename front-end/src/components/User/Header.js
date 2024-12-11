import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Toolbar, Button } from "@mui/material";
import FoodiImg from "../../assets/imgs/foodiIcon.png";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: "16px !important",
	backgroundColor: "#FDF5ED",
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	height: "40px",
	display: "flex",
	alignItems: "center",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "400px",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	position: "absolute",
	left: "8px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: "#D68240",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "#000",
	"& .MuiInputBase-input": {
		padding: theme.spacing(0.8, 1, 0.8, 4),
		fontSize: "14px",
		width: "100%",
	},
}));

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [restaurantId, setRestaurantId] = useState(null);
	const navigate = useNavigate();
	// const { isLoggedIn, user, logout } = useUser();

	// Function to check if the user is authenticated
	const checkAuthentication = () => {
		const accessToken = localStorage.getItem("access");
		const refreshToken = localStorage.getItem("refresh");
		const id = localStorage.getItem("res_id");

		// Update login status based on tokens presence
		setIsLoggedIn(!!(accessToken && refreshToken));
		// console.log("!!(accessToken && refreshToken): " ,!!(accessToken && refreshToken));
		// console.log("isloggedin ",isLoggedIn);
		if (id) {
			setRestaurantId(id); // Set restaurantId if present in localStorage
		}
	};

	useEffect(() => {
		// Initial check when the component mounts
		checkAuthentication();

		// Listener for changes in localStorage
		const handleStorageChange = () => {
			checkAuthentication(); // Recheck authentication when localStorage changes
		};

		// Attach event listener for storage changes
		window.addEventListener("storage", handleStorageChange);

		// Cleanup the event listener when the component unmounts
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []); // Empty dependency array to only run on mount and unmount

	const handleLoginClick = () => {
		navigate("/login"); // Navigate to login page
	};

	const handleProfileClick = () => {
		navigate(`/customer/profile`);
	};

	// const handleLogoutClick = () => {
	//   logout(); // Call logout from context to clear session
	//   navigate("/"); // Redirect to home after logout
	// };

	return (
		<AppBar
			elevation={1}
			sx={{
				backgroundColor: "#F4DCC9",
				boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
			}}
		>
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<img
					src={FoodiImg}
					alt="Login Illustration"
					style={{ width: "100px" }}
				/>
				<Search>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="جستجو در فودی"
						inputProps={{ "aria-label": "search" }}
					/>
				</Search>
				{!isLoggedIn ? (
					<Button
						variant="contained"
						color="primary"
						onClick={handleLoginClick}
						sx={{
							marginTop: "10px !important",
							width: "130px",
							height: "45px",
							borderRadius: "50px !important",
							fontWeight: "400 !important",
						}}
					>
						ورود یا عضویت
					</Button>
				) : (
					<Button
						variant="contained"
						color="primary"
						onClick={handleProfileClick}
						sx={{
							marginTop: "10px !important",
							width: "130px",
							height: "45px",
							borderRadius: "50px !important",
							fontWeight: "400 !important",
						}}
					>
						پروفایل
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
