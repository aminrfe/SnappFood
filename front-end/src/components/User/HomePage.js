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
import { FavoriteBorder, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/publicAxiosInstance";

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

const categories = [
	{ title: "رستوران", icon: "🍔" },
	{ title: "کافه", icon: "☕️" },
	{ title: "شیرینی", icon: "🍩" },
	{ title: "آبمیوه بستنی", icon: "🍹" },
	{ title: "ایرانی", icon: "🍽️" },
	{ title: "نانوایی", icon: "🍞" },
];

const CategoryCards = () => {
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

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				const response = await axiosInstance.get("/restaurant/list/");
				setRestaurants(response.data); // ذخیره داده‌های دریافت‌شده
				// console.log(response.data);
			} catch (error) {
				console.error("خطا در دریافت اطلاعات رستوران‌ها:", error);
			} 
		};

		fetchRestaurants();
	}, []);


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
				{restaurants.map((restaurant) => (
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
						<IconButton sx={{ position: "absolute", top: 8, right: 8 }}>
							<FavoriteBorder />
						</IconButton>
					</Card>
				))}
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
				onClick={() => navigate("/restaurantSignUp")}
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
