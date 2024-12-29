import React, { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Card,
	CardContent,
	Grid,
	Box,
	Select,
	MenuItem,
	CircularProgress,
} from "@mui/material";
import axios from "../../utills/axiosInstance";
import food1 from "../../assets/imgs/food1.png";
import food2 from "../../assets/imgs/food2.png";
import food3 from "../../assets/imgs/food3.png";

// const mockData = [
// 	{
// 		filter: "today",
// 		total_income: 1500,
// 		items: [
// 			{
// 				name: "اسم غذای نمونه 1",
// 				photo: food1,
// 				total_count: 5,
// 				total_price: 500,
// 			},
// 		],
// 	},
// 	{
// 		filter: "last_week",
// 		total_income: 7800,
// 		items: [
// 			{
// 				name: "اسم غذای نمونه 2",
// 				photo: food2,
// 				total_count: 8,
// 				total_price: 2400,
// 			},
// 			{
// 				name: "اسم غذای نمونه 3",
// 				photo: food3,
// 				total_count: 10,
// 				total_price: 5400,
// 			},
// 		],
// 	},
// 	{
// 		filter: "last_month",
// 		total_income: 15000,
// 		items: [
// 			{
// 				name: "اسم غذای نمونه 4",
// 				photo: food1,
// 				total_count: 15,
// 				total_price: 4500,
// 			},
// 			{
// 				name: "اسم غذای نمونه 5",
// 				photo: food2,
// 				total_count: 10,
// 				total_price: 6000,
// 			},
// 		],
// 	},
// ];

const RestaurantReportPage = () => {
	const [filter, setFilter] = useState("today");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch data from the API
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await axios.get(
					`/restaurant/sales-reports?filter=${filter}`,
				);
				setData(response.data); // Update state with API response
			} catch (err) {
				setError("خطایی در دریافت داده‌ها رخ داده است.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [filter]); // Re-fetch when the filter changes

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ textAlign: "center", marginTop: 4, color: "red" }}>
				<Typography>{error}</Typography>
			</Box>
		);
	}

	return (
		<Container sx={{ marginTop: 4, width: "70%" }}>
			{/* Header */}
			<Box
				sx={{
					backgroundColor: "#f5d5c0",
					padding: 2,
					borderRadius: 1,
					textAlign: "center",
					marginBottom: 2,
				}}
			>
				<Typography
					variant="h6"
					component="div"
					sx={{
						color: "#D68240",
						cursor: "default",
						pointerEvents: "none",
					}}
				>
					گزارش مالی فروشگاه
				</Typography>
			</Box>

			{/* Filter */}
			<Box sx={{ marginBottom: 3, textAlign: "center" }}>
				<Select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					sx={{ width: "200px" }}
				>
					<MenuItem value="today">گزارش روزانه</MenuItem>
					<MenuItem value="last_week">گزارش هفتگی</MenuItem>
					<MenuItem value="last_month">گزارش ماهانه</MenuItem>
				</Select>
			</Box>

			{/* List of Sold Items */}
			<Grid container spacing={2}>
				{data?.items.map((item, index) => (
					<Grid item xs={12} key={index}>
						<Card
							sx={{
								display: "flex",
								alignItems: "center",
								padding: 1,
								backgroundColor: "#ECECEC",
								boxShadow: "none",
							}}
						>
							<img
								src={item.photo}
								alt={item.name}
								style={{
									width: "75px",
									height: "80px",
									objectFit: "cover",
									borderRadius: "8px",
									marginRight: "16px",
								}}
							/>
							<CardContent
								sx={{
									flex: 1,
									paddingLeft: "16px",
									paddingTop: 0,
									paddingBottom: 0,
								}}
							>
								<Typography
									variant="body1"
									component="div"
									sx={{
										fontWeight: "bold",
										cursor: "default",
										pointerEvents: "none",
									}}
								>
									{item.name}
								</Typography>
								<Typography
									variant="body2"
									component="div"
									sx={{
										color: "#7D7D7D",
										cursor: "default",
										pointerEvents: "none",
									}}
								>
									تعداد فروش: {item.total_count}
								</Typography>
								<Typography
									variant="body2"
									component="div"
									sx={{
										color: "#7D7D7D",
										cursor: "default",
										pointerEvents: "none",
									}}
								>
									مجموع قیمت: {item.total_price.toLocaleString()} تومان
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Total Revenue */}
			<Box
				sx={{
					marginTop: 3,
					backgroundColor: "#f5d5c0",
					padding: 2,
					borderRadius: 1,
					textAlign: "center",
				}}
			>
				<Typography
					variant="h6"
					component="div"
					sx={{
						color: "#D68240",
						cursor: "default",
						pointerEvents: "none",
					}}
				>
					مجموع درآمد: {data?.total_income?.toLocaleString()} تومان
				</Typography>
			</Box>
		</Container>
	);
};

export default RestaurantReportPage;
