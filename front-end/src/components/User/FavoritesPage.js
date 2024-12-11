import React from "react";
import {
	Box,
	Typography,
	Card,
	CardMedia,
	CardContent,
	IconButton,
	Grid,
} from "@mui/material";

import Delete from '@mui/icons-material/Delete';
import Favorite from '@mui/icons-material/Favorite';
import Food1 from "../../assets/imgs/food1.png";
import Food2 from "../../assets/imgs/food2.png";
import Food3 from "../../assets/imgs/food3.png";
import Food4 from "../../assets/imgs/food4.png";

const FavoritesPage = () => {
	// آرایه علاقه‌مندی‌ها
	const favorites = [
		{ id: 1, name: "رستوران یک", image: Food1 },
		{ id: 2, name: "رستوران دو", image: Food2 },
		{ id: 3, name: "رستوران سه", image: Food3 },
		{ id: 4, name: "رستوران چهار", image: Food4 },
	];

	return (
		<Box sx={{ padding: 3 }}>
			<Typography
				variant="h5"
				sx={{
					textAlign: "center",
					marginBottom: 4,
					color: "#D68240",
					fontWeight: "bold",
				}}
			>
				لیست علاقه‌مندی‌های من
			</Typography>
			<Grid container spacing={2} justifyContent="center">
				{favorites.map((restaurant) => (
					<Grid item xs={12} sm={6} md={3} key={restaurant.id}>
						<Card
							sx={{
								position: "relative",
								padding: 5,
								borderRadius: "16px",
								boxShadow: 3,
								height: "320px", 
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								alignItems: "center",
								"&:hover": { transform: "scale(1.05)", boxShadow: 5 },
							}}
						>
							<CardMedia
								component="img"
								height="150"
								image={restaurant.image}
								alt={restaurant.name}
								sx={{
									borderRadius: "12px",
									width: "100%",
									objectFit: "cover",
								}}
							/>
							<CardContent sx={{ textAlign: "center", paddingBottom: "8px" }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										fontFamily: "'Vazir', sans-serif",
										fontSize: "1.2rem",
										color: "#333",
									}}
								>
									{restaurant.name}
								</Typography>
							</CardContent>

							
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-evenly",
									width: "100%",
								}}
							>
								<IconButton
								    sx={{ color: "#D68240" }}
								
									onClick={() => alert(`حذف ${restaurant.name}`)}
								>
									<Delete />
								</IconButton>
								<IconButton
									sx={{ color: "#FF1493" }} // Set color to deep pink
									// onClick={() => alert(`اضافه کردن ${restaurant.name} به علاقه‌مندی‌ها`)}
								>
									<Favorite />
								</IconButton>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default FavoritesPage;
