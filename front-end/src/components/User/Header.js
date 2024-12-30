import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FoodiImg from "../../assets/imgs/foodiIcon.png";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import axiosInstance from "../../utills/publicAxiosInstance";

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
	const [searchTerm, setSearchTerm] = useState("");
	const [restaurantList, setRestaurantList] = useState([]);
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [items, setItems] = useState([]);
	const [debounceTimeout, setDebounceTimeout] = useState(null);
	const navigate = useNavigate();

	const checkAuthentication = () => {
		const accessToken = localStorage.getItem("access");
		const refreshToken = localStorage.getItem("refresh");
		setIsLoggedIn(!!(accessToken && refreshToken));
	};

	useEffect(() => {
		checkAuthentication();
		const handleStorageChange = () => {
			checkAuthentication();
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const handleLoginClick = () => {
		navigate("/login");
	};

	const handleProfileClick = () => {
		navigate(`/customer/profile`);
	};

	const fetchRestaurantList = async (query) => {
		if (query.trim() === "") {
			setRestaurantList([]);
			setItems([]);
			return;
		}

		try {
			const params = { query };

			const response = await axiosInstance.get("/restaurant/profiles", {
				params,
			});

			const restaurants = await axiosInstance.get("/restaurant/profiles");
			setAllRestaurants(restaurants.data.restaurants);
			setRestaurantList(response.data.restaurants);
			setItems(response.data.items);
		} catch (error) {
			console.error("Error fetching restaurant list:", error);
			setRestaurantList([]);
			setItems([]);
		}
	};

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		const timeout = setTimeout(() => {
			fetchRestaurantList(value);
		}, 500);

		setDebounceTimeout(timeout);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			navigate(`/search?query=${searchTerm}`);
		}
	};

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
						value={searchTerm}
						onChange={handleSearchChange}
						onKeyPress={handleKeyPress}
					/>
					{(restaurantList.length > 0 || items.length > 0) && (
						<div
							style={{
								position: "absolute",
								top: "50px",
								left: "0",
								right: "0",
								backgroundColor: "#fff",
								borderRadius: "8px",
								boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
								zIndex: "100",
								maxHeight: "500px",
								overflowY: "auto",
							}}
							onMouseDown={(e) => e.stopPropagation()}
						>
							<ul style={{ listStyle: "none", margin: 0, padding: "10px" }}>
								{restaurantList.map((restaurant) => (
									<li key={restaurant.id} style={{ listStyle: "none" }}>
										<button
											style={{
												fontFamily: "vazir",
												padding: "10px",
												cursor: "pointer",
												border: "none",
												background: "none",
												borderBottom: "1px solid #f0f0f0",
												display: "flex",
												alignItems: "center",
											}}
											onClick={() => navigate(`/restaurant/${restaurant.id}`)}
										>
											{restaurant.photo && (
												<img
													src={`http://127.0.0.1:8000${restaurant.photo}`}
													alt={restaurant.name}
													style={{
														width: "80px",
														height: "80px",
														borderRadius: "4px",
														marginRight: "10px",
													}}
												/>
											)}
											<div>
												<div
													style={{
														fontSize: "16px",
														fontWeight: "bold",
														marginRight: "10px",
														color: "#555",
													}}
												>
													{restaurant.name}
												</div>
												<div
													style={{
														fontSize: "12px",
														color: "#555",
														marginRight: "10px",
														textAlign: "right",
													}}
												>
													{restaurant.city_name}
												</div>
											</div>
										</button>
									</li>
								))}
								{/* New Section for Items */}
								{items.length > 0 && (
									<React.Fragment>
										<hr
											style={{
												margin: "10px 0",
												border: "none",
												borderTop: "1px solid #f0f0f0",
											}}
										/>
										<li
											style={{
												fontWeight: "bold",
												color: "#555",
												padding: "5px 10px",
											}}
										>
											آیتم‌ها
										</li>
										{items.map((item) => {
											const restaurant = allRestaurants.find(
												(rest) => rest.id === item.restaurant,
											);

											return (
												<li
													key={item.item_id}
													role="button"
													tabIndex={0}
													style={{
														padding: "10px",
														cursor: "pointer",
														borderBottom: "1px solid #f0f0f0",
														display: "flex",
														alignItems: "center",
													}}
													onClick={() =>
														navigate(
															`/restaurant/${item.restaurant}/${item.item_id}`,
														)
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															navigate(
																`/restaurant/${item.restaurant}/${item.item_id}`,
															);
														}
													}}
												>
													{item.photo && (
														<img
															src={`http://127.0.0.1:8000${item.photo}`}
															alt={item.name}
															style={{
																width: "80px",
																height: "80px",
																borderRadius: "4px",
																marginRight: "10px",
															}}
														/>
													)}
													<div>
														<div
															style={{
																fontWeight: "bold",
																marginRight: "10px",
																color: "#555",
															}}
														>
															{item.name}
														</div>
														<div
															style={{
																fontSize: "12px",
																color: "#555",
																marginRight: "10px",
															}}
														>
															{restaurant.name}
														</div>
													</div>
												</li>
											);
										})}
									</React.Fragment>
								)}
							</ul>
						</div>
					)}
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
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<ShoppingCartIcon
							sx={{
								color: "#555",
								cursor: "pointer",
								"&:hover": { color: "#000" },
							}}
							onClick={() => navigate("/cart-list")}
						/>
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
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
