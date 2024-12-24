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
	const [foodData, setFoodData] = useState([]);
	const [addedToCart, setAddedToCart] = useState({}); 

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
				const updatedFavorites = {};
				response.data.forEach((fav) => {
					updatedFavorites[fav.restaurant] = true; 
				});
				setFavorites(updatedFavorites); 
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

	useEffect(() => {
		fetchFoodData();
		fetchCartData();
	}, [id]);
	

	const fetchFoodData = async () => {
		try {
			const response = await axiosInstance.get(`/customer/restaurants/${id}/items`);
			const allData = response.data;
			setFoodData(allData);
		} catch (error) {
			console.error("خطا در دریافت داده‌ها:", error.response?.data || error.message);
			alert("خطا در دریافت داده‌ها.");
		}
	};

	const fetchCartData = async () => {
		try {
		  const response = await axiosInstance.get("/customer/carts", {
			params: { restaurant_id: id },
		  });	  
		  const cartItems = response.data?.[0]?.cart_items || []; 	  
		  const cartStatus = {};
		  cartItems.forEach((item) => {
			cartStatus[item.item] = true; 
		  });	  
		  setAddedToCart(cartStatus);
		} catch (error) {
		  console.error("خطا در دریافت اطلاعات سبد خرید:", error.response?.data || error.message);
		}
	  };
	  
	  const handleAddToCart = async (foodItem) => {
		try {
		  const response = await axiosInstance.post("/customer/carts", {
			restaurant_id: id,
			item_id: foodItem.item_id,
			count: 1,
		  });
	
		  if (response.status === 201) {
			setAddedToCart((prevState) => ({
			  ...prevState,
			  [foodItem.item_id]: true,
			}));
		  }
		} catch (error) {
		  console.error("خطا در افزودن آیتم به سبد خرید:", error);
		}
	  };
	  
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
					<Chip label={deliveryCost === 0 ? "رایگان" : `${Math.floor(parseFloat(deliveryCost)).toLocaleString()} تومان`} />
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
				<Button variant="contained" color="success" fullWidth
						onClick={() => navigate(`/cart?restaurant_id=${id}`)}
				>
					مشاهده سبد خرید
				</Button>
			</Grid>

			<Grid>
				<Box sx={{ width: { lg: "700px" } }}>
					<Box sx={{ cursor: "pointer" }}>
						{foodData.length > 0 ? (
							foodData.map((food) => (
								<Card
									key={food.item_id}
									onClick={() => navigate(`/restaurant/${id}/${food.item_id}`)}
									sx={{
										display: "flex",
										mb: 2,
										boxShadow: "none",
										paddingBottom: 2,
										borderRadius: 0,
										borderBottom: "1px solid gray",
									}}
								>
									<Box sx={{ position: "relative" }}>
										<CardMedia
											component="img"
											image={food.photo}
											alt={food.name}
											sx={{ width: 120, borderRadius: 3 }}
										/>
										{food.discount > 0 && (
											<Box
												sx={{
													position: "absolute",
													top: 8,
													right: 8,
													backgroundColor: "red",
													color: "white",
													fontSize: "12px",
													fontWeight: "bold",
													padding: "2px 6px",
													borderRadius: "3px",
												}}
											>
												{food.discount}٪ تخفیف
											</Box>
										)}
									</Box>
									
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
										<Box sx={{ paddingTop: 2 }}>
											{food.discount > 0 ? (
												<>
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{
															textDecoration: "line-through",
															display: "inline-block",
															marginRight: "8px",
														}}
													>
														{Math.floor(food.price).toLocaleString()} تومان
													</Typography>
													<Typography
														variant="body1"
														color="#D68240"
														sx={{ display: "inline-block" }}
													>
														{Math.floor(food.price * (1 - food.discount / 100)).toLocaleString()} تومان
													</Typography>
												</>
											) : (
												<Typography
													variant="body1"
													sx={{ pointerEvents: "none" }}
												>
													{Math.floor(food.price).toLocaleString()} تومان
												</Typography>
											)}
										</Box>
									</CardContent>
										
									<Button
            						  variant="contained"
            						  onClick={(event) => {
										event.stopPropagation(); // جلوگیری از اجرای رویداد کارت
										handleAddToCart(food); // افزودن آیتم به سبد خرید
									  }}
            						  disabled={!!addedToCart[food.item_id]} // غیرفعال کردن دکمه پس از افزودن
            						  sx={{
            						    backgroundColor: addedToCart[food.item_id] ? "gray" : "#D68240",
            						    color: addedToCart[food.item_id] ? "white" : "black",
            						    alignSelf: "center",
            						    margin: 1,
            						    borderRadius: 20,
            						  }}
            						>
            						  {addedToCart[food.item_id] ? "افزوده شد" : "افزودن"}
            						</Button>
								</Card>
							))
						) : (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ textAlign: "center" }}
							>
								هیچ غذایی در منو وجود ندارد.
							</Typography>
							)}
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default RestaurantPage;
