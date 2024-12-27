import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardMedia,
	CardContent,
	Typography,
	IconButton,
	Button,
} from "@mui/material";
import Footer from "./Footer";
import Grid from "@mui/material/Grid2";
import BigPizza from "../../assets/imgs/big-pizza.png";
import { FavoriteBorder, Favorite, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import publicAxiosInstance from "../../utills/publicAxiosInstance";


const HeroSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
				display: "flex",
				paddingTop: "100px",
				paddingBottom: "40px",
				backgroundColor: "#fff",
			}}
		>
			<Grid container spacing={2} alignItems="center">
				<Grid item xs={12} md={6} marginLeft={12}>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							color: "#000",
							fontWeight: "bold",
							textAlign: { xs: "center", md: "left" },
							pointerEvents: "none",
						}}
					>
						توی کوتاه‌ترین زمان ممکن
					</Typography>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							color: "#D68240",
							fontWeight: "bold",
							marginTop: "15px",
							marginLeft: "25px",
							textAlign: { xs: "center", md: "left" },
							pointerEvents: "none",
						}}
					>
						غذای مورد علاقت رو سفارش بده.
					</Typography>
				</Grid>

				<Grid>
					<img
						src={BigPizza}
						alt="Hero Pizza"
						style={{
							marginRight: "15vw",
							width: "600px",
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

const CategoryCards = () => {	
	const navigate = useNavigate();

	const handleCategoryClick = (businessType) => {
		navigate(`/search?business_type=${businessType}`);
	};

	const categories = [
		{ title: "رستوران", icon: "🍔", type: "restaurant" },
		{ title: "کافه", icon: "☕️", type: "cafe" },
		{ title: "شیرینی", icon: "🍩", type: "sweets" },
		{ title: "آبمیوه و بستنی", icon: "🍹", type: "ice_cream" },
		{ title: "نانوایی", icon: "🍞", type: "bakery" },
	];

	return (
		<Box sx={{ width: "100%" }}>
			<Typography
				variant="h5"
				sx={{
					margin: 2,
					color: "#D68240",
					fontWeight: "bold",
					pointerEvents: "none",
				}}
			>
				دسته بندی‌ها
			</Typography>
			<Grid
				container
				spacing={2}
				backgroundColor={"#F4DCC9"}
				padding={3}
				width={"100%"}
				sx={{
					alignItems: "center",
					justifyContent: "center",
					display: "flex",
				}}
			>
				{categories.map((category, index) => (
					<Grid xs={6} sm={4} md={2.4} key={index}>
						<Card
							onClick={() => handleCategoryClick(category.type)}
							sx={{
								cursor: "pointer",
								textAlign: "center",
								padding: 2,
								margin: 1,
								width: "200px",
								borderRadius: "20px",
								boxShadow: 0,
								"&:hover": {
									transform: "scale(1.05)",
									border: "2px solid #D68240",
								},
							}}
						>
							<Typography
								variant="h3"
								sx={{ pointerEvents: "none", paddingTop: "11px" }}
							>
								{category.icon}
							</Typography>
							<CardContent sx={{ paddingBottom: "10px !important" }}>
								<Typography sx={{ pointerEvents: "none" }}>
									{category.title}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

const ProductSlider = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const checkAuthentication = () => {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");
        setIsLoggedIn(!!(accessToken && refreshToken));
    };

	useEffect(() => {
		checkAuthentication();
	}, []);

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				const response = await publicAxiosInstance.get("/restaurant/list/");
				const sortedRestaurants = response.data.sort((a, b) => b.score - a.score); 
        		setRestaurants(sortedRestaurants);
			} catch (error) {
				console.error("خطا در دریافت اطلاعات رستوران‌ها:", error);
			}
		};

		const fetchFavorites = async () => {
			if (isLoggedIn) {
				try {
					const response = await axiosInstance.get("/customer/favorites");
					const favoriteMap = {};
					response.data.forEach((fav) => {
						favoriteMap[fav.restaurant] = true; 
					});
					setFavorites(favoriteMap);
				} catch (error) {
					console.error("خطا در دریافت علاقه‌مندی‌ها:", error);
				}
			}
		};

		fetchRestaurants();
		fetchFavorites();
	}, [isLoggedIn]);

	const toggleFavorite = async (restaurantId) => {
		if (!isLoggedIn) {
			alert("برای افزودن به علاقه‌مندی‌ها لطفاً ابتدا وارد حساب خود شوید.");
			return;
		}

		const isFavorite = favorites[restaurantId];
		try {
			if (isFavorite) {
				await axiosInstance.delete(`/customer/favorites`, {
					params: { restaurant_id: restaurantId },
				});
				setFavorites((prevFavorites) => ({
					...prevFavorites,
					[restaurantId]: false,
				}));
			} else {
				await axiosInstance.post("/customer/favorites", {
					restaurant_id: restaurantId,
				});
				setFavorites((prevFavorites) => ({
					...prevFavorites,
					[restaurantId]: true,
				}));
			}
		} catch (error) {
			console.error("خطا در تغییر علاقه‌مندی‌ها:", error);
		}
	};

    return (
        <Box sx={{ width: "100%" }}>
            <Typography
                variant="h5"
                sx={{
                    margin: 2,
                    marginTop: 8,
                    color: "#D68240",
                    fontWeight: "bold",
                    pointerEvents: "none",
                }}
            >
                محبوب ترین ها
            </Typography>
            <Grid
                container
                spacing={2}
                backgroundColor={"#F4DCC9"}
                padding={3}
                width={"100%"}
            >
                {restaurants.map((restaurant) => {
                    const isFavorite = favorites[restaurant.id]; 

                    return (
                        <Card
                            key={restaurant.id}
                            onClick={() => navigate(`restaurant/${restaurant.id}`)}
                            sx={{
                                cursor: "pointer",
                                padding: 2,
                                margin: 1,
                                minWidth: 250,
                                borderRadius: "20px",
                                boxShadow: 0,
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    border: "2px solid #D68240",
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={`http://127.0.0.1:8000${restaurant.photo}`}
                                alt={restaurant.name}
                            />
                            <CardContent>
                                <Typography variant="h6" sx={{ pointerEvents: "none" }}>
                                    {restaurant.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ pointerEvents: "none" }}
                                >
                                    <Star sx={{ paddingTop: "12px" }} />
                                    امتیاز: {restaurant.score}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ pointerEvents: "none" }}
                                >
                                    هزینه ارسال: {Math.floor(parseFloat(restaurant.delivery_price))} تومان
                                </Typography>
                            </CardContent>
                            <IconButton
                                sx={{ position: "absolute", top: 8, right: 8 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(restaurant.id);
                                }}
                            >
                                {isFavorite ? (
                                    <Favorite sx={{ color: "red" }} />
                                ) : (
                                    <FavoriteBorder />
                                )}
                            </IconButton>
                        </Card>
                    );
                })}
            </Grid>
        </Box>
    );
};

const UpFooter = () => {
	const navigate = useNavigate();
	return (
		<Grid container>
			<Box marginLeft={12} marginTop={8} marginBottom={8} marginRight={15}>
				<Typography
					variant="h4"
					sx={{
						marginBottom: 2,
						color: "#D68240",
						fontWeight: "bold",
						pointerEvents: "none",
					}}
				>
					صاحب یک کسب و کار هستید؟
				</Typography>
				<Typography
					variant="h5"
					sx={{
						marginBottom: 2,
						color: "black",
						// fontWeight: "bold",
						pointerEvents: "none",
					}}
				>
					با فودی کسب و کارتان را آنلاین کنید و فروشتان را افزایش دهید.
				</Typography>
			</Box>
			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate("/restuarant-signup")}
				sx={{
					marginTop: "100px !important",
					width: "155px",
					height: "50px",
					borderRadius: "50px !important",
					fontWeight: "400 !important",
				}}
			>
				ثبت نام فروشندگان
			</Button>
		</Grid>
	);
};

const HomePage = () => {
	return (
		<div>
			<HeroSection />
			<CategoryCards />
			<ProductSlider />
			<UpFooter />
			<Footer />
		</div>
	);
};

export default HomePage;
