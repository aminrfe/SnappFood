import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Food1 from "../../assets/imgs/food1.png";
import Food2 from "../../assets/imgs/food2.png";
import Food3 from "../../assets/imgs/food3.png";
import Food4 from "../../assets/imgs/food4.png";
import { FavoriteBorder, Star } from "@mui/icons-material";

const RestaurantPage = () => {
	const navigate = useNavigate();
	const categories = [
		{ id: 1, name: "غذای ۱" },
		{ id: 2, name: "غذای ۲" },
		{ id: 3, name: "غذای ۳" },
		{ id: 4, name: "غذای ۴" },
	];

	const foodData = {
		1: [
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
		],
		2: [
			{
				id: 3,
				name: "اسم غذای نمونه ۳",
				description: "توضیحات نمونه ۳",
				price: "۲۱۰۰۰۰",
				image: Food3,
			},
		],
		3: [],
		4: [
			{
				id: 4,
				name: "اسم غذای نمونه ۴",
				description: "توضیحات نمونه ۴",
				price: "۱۸۰۰۰۰",
				image: Food4,
			},
		],
	};
	const [selectedCategory, setSelectedCategory] = useState(1);

	const handleChange = (event, newValue) => {
		setSelectedCategory(newValue);
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
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Grid>
				<Box
					sx={{
						position: "relative",
						width: "fit-content",
						mx: "auto"
					}}
				>
					<img
						src={Food1}
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
							color: "white",
						}}
					>
						<FavoriteBorderIcon />
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
					<Chip label="۲۰ دقیقه" />
					<Chip label="رایگان" />
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center">
					<Typography variant="h6" sx={{ pointerEvents: "none", py: 1 }}>
						اسم رستوران نمونه
					</Typography>
				</Box>
				<Typography
					variant="body2"
					sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
				>
					لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده
					از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و
					سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای
					متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه
					درصد گذشته حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با
					نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان
					خلاقی
				</Typography>
				<Button variant="contained" color="success" fullWidth>
					مشاهده سبد خرید
				</Button>
			</Grid>

			<Grid>
				<Box sx={{ width: { lg: "700px" } }}>
					{/* Category Tabs */}
					<Tabs
						value={selectedCategory}
						onChange={handleChange}
						variant="scrollable"
						textColor="primary"
						indicatorColor="primary"
						aria-label="food categories"
						sx={{ mb: 2 }}
					>
						{categories.map((category) => (
							<Tab
								key={category.id}
								label={category.name}
								value={category.id}
							/>
						))}
					</Tabs>

					{/* Food List */}
					<Box sx={{ cursor: "pointer" }}>
						{foodData[selectedCategory].length > 0 ? (
							foodData[selectedCategory].map((food) => (
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
