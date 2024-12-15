import React, { useState, useEffect  } from "react";
import { useNavigate, useParams  } from "react-router-dom";
import {
	Box,
	Typography,
	Button,
	IconButton,
	Chip,
	Card,
	CardMedia,
	CardContent,
	Tabs,
	Tab,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import publicAxiosInstance from "../../utills/publicAxiosInstance";
import axiosInstance from "../../utills/axiosInstance";
import Food1 from "../../assets/imgs/food1.png";
import Food2 from "../../assets/imgs/food2.png";
import Food3 from "../../assets/imgs/food3.png";
import Food4 from "../../assets/imgs/food4.png";

const RestaurantPage = () => {
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [deliveryCost, setDeliveryCost] = useState("");
	const [cityName, setCityName] = useState("");
	const [description, setDescription] = useState("");
	const [openingTime, setOpeningTime] = useState(null);
	const [closingTime, setClosingTime] = useState(null);
	const [logo, setLogo] = useState(null);
	const { id } = useParams(); 
  	const navigate = useNavigate();
  	const [restaurantId, setRestaurantId] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [favorites, setFavorites] = useState({});

  	useEffect(() => {
    	setRestaurantId(id); 
 	}, [id]);

	useEffect(() => {
		if (restaurantId) {
		  fetchProfileData();
		}
	}, [restaurantId]);

	useEffect(() => {
		const token = localStorage.getItem("access");
		if (token) {
		  setIsAuthenticated(true);
		} else {
		  setIsAuthenticated(false);
		}
	  }, []);

	useEffect(() => {
		const checkIfFavorite = async () => {
			if (!isAuthenticated || !restaurantId) return;
		
			try {
				const response = await axiosInstance.get("/customer/favorites");
				console.log("Favorites data:", response.data);
		
				// ایجاد یک آبجکت جدید که وضعیت علاقه‌مندی تمام رستوران‌ها را نگه می‌دارد
				const updatedFavorites = {};
				response.data.forEach((fav) => {
					updatedFavorites[fav.restaurant] = true; // اگر رستورانی در لیست علاقه‌مندی‌ها است، مقدارش true می‌شود
				});
		
				setFavorites(updatedFavorites); // به‌روزرسانی state
			} catch (error) {
				console.error("Error checking favorites:", error);
			}
		};
	  
		if (restaurantId) {
		  checkIfFavorite();
		}
	  }, [restaurantId, isAuthenticated]);
	  
	  const toggleFavorite = async () => {
		if (!isAuthenticated) {
			alert("لطفا ابتدا وارد حساب کاربری خود شوید!");
			return;
		}
	
		try {
			if (favorites[restaurantId]) {
				const response = await axiosInstance.delete(`/customer/favorites`, {
					params: { restaurant_id: restaurantId },
				});
	
				if (response.status === 204) {
					alert("رستوران از علاقه‌مندی‌ها حذف شد.");
	
					setFavorites((prevFavorites) => ({
						...prevFavorites,
						[restaurantId]: false, 
					}));
				}
			} else {
				const response = await axiosInstance.post("/customer/favorites", {
					restaurant_id: parseInt(restaurantId),
				});
	
				if (response.status === 201) {
					alert("رستوران به علاقه‌مندی‌ها اضافه شد.");
	
					setFavorites((prevFavorites) => ({
						...prevFavorites,
						[restaurantId]: true,
					}));
				}
			}
		} catch (error) {
			console.error("Error toggling favorite:", error);
			if (error.response) {
				console.error("Error response data:", error.response.data);
			}
		}
	};


	const fetchProfileData = async () => {
		if (!id) {
			console.error("userId is undefined. Cannot fetch profile data.");
			return;
		}

		try {
			const response = await publicAxiosInstance.get(`/restaurant/${id}/profile`);
			const data = response.data;

			if (data) {
				console.log(data);
				setName(data.name || "");
				setAddress(data.address || "");
				setDeliveryCost(data.delivery_price || "");
				setDescription(data.description || "");
				setOpeningTime(data.open_hour.slice(0,5));
				setClosingTime(data.close_hour.slice(0,5));
				setCityName(data.city_name || "");
				if (data.photo) {
					setLogo(data.photo);
				}
			} else {
				console.error("No data received from API");
			}
		} catch (error) {
			console.error("Error fetching profile data:", error);
		}
	};

	const categories = [
		{ id: 1, name: "غذای ۱" },
		{ id: 2, name: "غذای ۲" },
		{ id: 3, name: "غذای ۳" },
		{ id: 4, name: "غذای ۴" },
	];

	
	const foodData = [
		{
			id: 1,
			name: "اسم غذای نمونه ۱",
			description: "توضیحات نمونه ۱",
			price: "۳۴۰۰۰۰",
			image: Food1,
		},
		{
			id: 2,
			name: "اسم غذای نمونه ۲",
			description: "توضیحات نمونه ۲",
			price: "۴۵۰۰۰۰",
			image: Food2,
		},
		{
			id: 3,
			name: "اسم غذای نمونه ۳",
			description: "توضیحات نمونه ۳",
			price: "۲۱۰۰۰۰",
			image: Food3,
		},
		{
			id: 4,
			name: "اسم غذای نمونه ۴",
			description: "توضیحات نمونه ۴",
			price: "۱۸۰۰۰۰",
			image: Food4,
		},

		{
			id: 5,
			name: "اسم غذای نمونه ۲",
			description: "توضیحات نمونه ۲",
			price: "۴۵۰۰۰۰",
			image: Food2,
		},
		{
			id: 6,
			name: "اسم غذای نمونه ۳",
			description: "توضیحات نمونه ۳",
			price: "۲۱۰۰۰۰",
			image: Food3,
		},
		{
			id: 7,
			name: "اسم غذای نمونه ۴",
			description: "توضیحات نمونه ۴",
			price: "۱۸۰۰۰۰",
			image: Food4,
		},
	];

	return (
		<Grid
			container
			gap={8}
			sx={{
				width: "100%",
				p: {
					xs: 2,
					sm: 3,
					md: 4,
				},
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Grid>
				<Box
					sx={{
						position: "relative",
						width: "fit-content",
						mx: "auto",
					}}
				>
					<img
						src={`${logo}`}
						alt="Food"
						style={{
							height: "300px",
							display: "block",
							borderRadius: 18,
						}}
					/>
					<IconButton
  						sx={{
   						position: "absolute",
    					bottom: 8,
    					left: 8,
    					color: favorites[restaurantId] ? "red" : "white",
  						}}
  						onClick={toggleFavorite}
					>
  						{favorites[restaurantId] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					flexDirection="row"
					gap={2}
					alignItems="center"
					py={2}
				>
					<Chip label="۴.۷" />
					<Chip label={cityName} />
					<Chip label={deliveryCost === 0 ? "رایگان" : `${Math.floor(parseFloat(deliveryCost))} تومان`} />
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center">
					<Typography variant="h6" sx={{ pointerEvents: "none", py: 1 }}>
						{name}
					</Typography>
				</Box>
				<Typography
					variant="body2"
					sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
				>
					ساعت کاری: {openingTime} تا {closingTime}
				</Typography>
				<Typography
					variant="body2"
					color="grey"
					sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" }}}
				>
					آدرس: {address}
				</Typography>
				<Typography
					variant="body2"
					sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
				>
					{description}
				</Typography>
				<Button variant="contained" color="success" fullWidth>
					مشاهده سبد خرید
				</Button>
			</Grid>

			<Grid>
				<Box sx={{ width: { lg: "700px" } }}>
					{/* Category Tabs */}
					

					{/* Food List */}
					<Box sx={{ cursor: "pointer" }}>
						{foodData.length > 0 ? (
							foodData.map((food) => (
								<Card
									key={food.id}
									onClick={() => navigate("/menu-item")}
									sx={{
										display: "flex",
										mb: 2,
										boxShadow: "none",
										paddingBottom: 2,
										borderRadius: 0,
										borderBottom: "1px solid gray",
										// "&:hover": {
										// 	backgroundColor: "black", // Change this to your desired hover color
										// },
									}}
								>
									<CardMedia
										component="img"
										image={food.image}
										alt={food.name}
										sx={{ width: 120, borderRadius: 3 }}
									/>
									<CardContent sx={{ flex: 1 }}>
										<Typography variant="h6" sx={{ pointerEvents: "none" }}>
											{food.name}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ pointerEvents: "none" }}
										>
											{food.description}
										</Typography>
										<Typography
											variant="body1"
											sx={{ pointerEvents: "none", paddingTop: 2 }}
										>
											{food.price} تومان
										</Typography>
									</CardContent>
									<Button
										variant="contained"
										sx={{
											backgroundColor: "white !important",
											fontWeight: "normal !important",
											color: "#D68240 !important",
											border: "1px solid #D68240",
											alignSelf: "center",
											margin: 1,
											borderRadius: 20,
											"&:hover": {
												border: "2px solid #D68240",
												backgroundColor: "inherit",
											},
										}}
									>
										افزودن
									</Button>
								</Card>
							))
						) : (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ textAlign: "center" }}
							>
								هیچ غذایی در این دسته وجود ندارد.
							</Typography>
						)}
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default RestaurantPage;
