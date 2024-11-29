import React from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import Grid from "@mui/material/Grid2";
import BigPizza from "../../assets/imgs/big-pizza.png";

const HeroSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
				display: "flex",
				// justifyContent: "center",
				// alignItems: "center",
				minHeight: "400px",
				backgroundColor: "#fff",
				padding: "20px",
				marginTop: "400px",
			}}
		>
			<Grid container spacing={2} alignItems="center">
				{/* Text Section */}
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
	{ title: "فست فود", icon: "🍔" },
	{ title: "پیتزا", icon: "🍕" },
	{ title: "سوپ", icon: "🥣" },
	{ title: "کافه", icon: "☕" },
	{ title: "پروتئین", icon: "🍗" },
	{ title: "سوپ", icon: "🥣" },
	// { title: "کافه", icon: "☕" },
	// { title: "پروتئین", icon: "🍗" },
];

const CategoryCards = () => {
	return (
		<Box sx={{ width: "100%" }}>
			<Typography
				variant="h5"
				sx={{
					marginBottom: 2,
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
							<Typography variant="h3" sx={{ pointerEvents: "none" }}>
								{category.icon}
							</Typography>
							<CardContent>
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

const products = [
	{ title: "رستوران نمونه", image: "https://via.placeholder.com/200x150" },
	{ title: "رستوران دوم", image: "https://via.placeholder.com/200x150" },
	{ title: "رستوران سوم", image: "https://via.placeholder.com/200x150" },
];

const ProductSlider = () => {
	return (
		<Grid container spacing={2} sx={{ padding: 3 }}>
			{products.map((product, index) => (
				<Grid item xs={12} sm={6} md={4} key={index}>
					<Card>
						<CardMedia
							component="img"
							height="150"
							image={product.image}
							alt={product.title}
						/>
						<CardContent>
							<Typography>{product.title}</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

const HomePage = () => {
	return (
		<div>
			<Header />
			<HeroSection />
			<CategoryCards />
			<ProductSlider />
			<Footer />
		</div>
	);
};

export default HomePage;
