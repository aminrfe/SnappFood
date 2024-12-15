import React, { useEffect, useState } from "react";import {
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
import axiosInstance from "../../utills/axiosInstance";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {

	const [favorites, setFavorites] = useState([]);
	const [fullFavoritesData, setFullFavoritesData] = useState([]);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		axiosInstance
			.get("/customer/favorites")  
			.then((response) => {
				// console.log(response.data);
				setFavorites(response.data);
			})
			.catch((err) => {
				setError("خطا در بارگذاری داده‌ها");
			});
	}, []);

	useEffect(() => {
		const fetchAllRestaurantsDetails = async () => {
			try {
				const restaurantPromises = favorites.map((restaurant) =>
					axiosInstance.get(`/restaurant/${restaurant.restaurant}/profile`) 
				);

				const restaurantResponses = await Promise.all(restaurantPromises);
				const fullData = restaurantResponses.map((response, index) => {
					return {
						...favorites[index],
						...response.data, 
					};
				});
				setFullFavoritesData(fullData);
			} catch (err) {
				setError("خطا در دریافت جزئیات رستوران‌ها");
			}
		};

		if (favorites.length > 0) {
			fetchAllRestaurantsDetails();
		}
	}, [favorites]);

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
			<Grid container spacing={1} justifyContent="center">
				{fullFavoritesData.map((restaurant) => (
					<Grid item xs={12} sm={6} md={4} key={restaurant.id} sx={{ flexGrow: 1 }}>
						<Card
							sx={{
								position: "relative",
								padding: 5,
								borderRadius: "16px",
								boxShadow: 3,
								height: "310px",
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								alignItems: "center",
								// width: "100%", 
								maxWidth: "100%",
								"&:hover": { transform: "scale(1.05)", boxShadow: 5 },
							  }}
							  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
						>
							<CardMedia
    							component="img"
    							// height="350px"
   								image={restaurant.photo}
   								alt={restaurant.name}
   								sx={{
   								  borderRadius: "12px",
   								//   width: "100%", 
   								  objectFit: "cover", 
   							}}
							></CardMedia>
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
									sx={{ color: "#FF1493" }}
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
