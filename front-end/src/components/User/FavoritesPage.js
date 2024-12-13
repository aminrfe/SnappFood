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
		// ارسال درخواست GET به API برای دریافت داده‌های علاقه‌مندی‌ها از axiosInstance
		axiosInstance
			.get("/customer/favorites")  // مسیر API مطابق با axiosInstance
			.then((response) => {
				// به روز رسانی آرایه علاقه‌مندی‌ها
				// console.log(response.data);
				setFavorites(response.data);
				// setLoading(false);
			})
			.catch((err) => {
				// اگر خطا رخ دهد، آن را در حالت خطا قرار می‌دهیم
				setError("خطا در بارگذاری داده‌ها");
				// setLoading(false);
			});
	}, []);

	useEffect(() => {
		// وقتی favorites تغییر کرد، جزئیات هر رستوران را دریافت کن
		const fetchAllRestaurantsDetails = async () => {
			try {
				const restaurantPromises = favorites.map((restaurant) =>
					axiosInstance.get(`/restaurant/${restaurant.id}/profile`) // درخواست برای جزئیات هر رستوران
				);

				// صبر کردن برای اتمام همه درخواست‌ها
				const restaurantResponses = await Promise.all(restaurantPromises);

				// ذخیره کردن داده‌های کامل رستوران‌ها
				const fullData = restaurantResponses.map((response, index) => {
					// ادغام اطلاعات رستوران‌ها (اطلاعات اولیه با جزئیات)
					return {
						...favorites[index],
						...response.data, // اطلاعات کامل رستوران
					};
				});

				// به روز رسانی state با داده‌های کامل
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
			<Grid container spacing={2} justifyContent="center">
				{fullFavoritesData.map((restaurant) => (
					<Grid item xs={12} sm={6} md={3} key={restaurant.id} sx={{ flexGrow: 1 }}>
						<Card
							sx={{
								position: "relative",
								padding: 5,
								borderRadius: "16px",
								boxShadow: 3,
								height: "300px", // این ارتفاع ثابت باید مشخص باشد
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%", // عرض کارت را به 100% تنظیم می‌کنیم
								maxWidth: "100%", // جلوگیری از کوچک شدن کارت
								"&:hover": { transform: "scale(1.05)", boxShadow: 5 },
							  }}
							  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
						>
							<CardMedia
    							component="img"
    							height="400"
   								image={restaurant.photo}
   								alt={restaurant.name}
   								sx={{
   								  borderRadius: "12px",
   								  width: "100%", // عرض تصویر را به 100% تنظیم می‌کند
   								  objectFit: "cover", // برای پر کردن فضای موجود و حفظ تناسب تصویر
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
