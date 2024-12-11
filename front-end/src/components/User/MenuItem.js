import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	IconButton,
	Chip,
	Avatar,
	Rating,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Food1 from "../../assets/imgs/food1.png";

const FoodItemPage = () => {
	const [quantity, setQuantity] = useState({
		small: 0,
		medium: 0,
		large: 0,
	});
	const [size, setSize] = useState("small");

	const priceMapping = {
		small: 16000,
		medium: 18000,
		large: 20000,
	};

	const pricePerItem = priceMapping[size];

	const handleSizeChange = (newSize) => {
		setSize(newSize);
	};

	const handleQuantityChange = (delta) => {
		setQuantity((prevQuantity) => ({
			...prevQuantity,
			[size]: Math.max(prevQuantity[size] + delta, 0),
		}));
	};

	const buttonStyles = (sizeOption) => ({
		backgroundColor: size === sizeOption ? "#D68240" : "#F4DCC9", // Blue for selected, light gray for non-selected
		color: size === sizeOption ? "#fff" : "#000", // White text for selected, black for non-selected
		borderColor: "#D68240", // Border color change
		"&:hover": {
			backgroundColor: "#fff", // Darker hover color for selected
		},
	});

	const comments = [
		{
			id: 1,
			name: "اسم کاربر 1",
			date: "۱۸ آبان ۱۴۰۳",
			rating: 4,
			comment: "Really convenient and the points system helps benefit loyalty",
		},
		{
			id: 2,
			name: "اسم کاربر 2",
			date: "۱۸ آبان ۱۴۰۳",
			rating: 4,
			comment: "Really convenient and the points system helps benefit",
		},
		{
			id: 3,
			name: "اسم کاربر 3",
			date: "۱۸ آبان ۱۴۰۳",
			rating: 4,
			comment:
				" glitches here and there, but nothing too egregious. Obviously needs to roll out to more remote.",
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
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Grid>
				<Box sx={{ position: "relative", width: "fit-content" }}>
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
					py={1}
				>
					<Chip label="۴.۷" />
					<Chip label="۲۰ دقیقه" />
					<Chip label="رایگان" />
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center">
					<Typography variant="h6" sx={{ pointerEvents: "none", py: 1 }}>
						اسم غذای نمونه
					</Typography>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center">
					<Typography
						variant="subtitle1"
						color="textSecondary"
						sx={{ pointerEvents: "none" }}
					>
						اسم رستوران نمونه
					</Typography>
				</Box>
				<Box display="flex" justifyContent="center" gap={1}>
					{["small", "medium", "large"].map((sizeOption) => (
						<Button
							key={sizeOption}
							variant={size === sizeOption ? "contained" : "outlined"}
							sx={{
								backgroundColor: size === sizeOption ? "#D68240" : "#F4DCC9",
								color: size === sizeOption ? "#fff" : "#000",
								borderColor: "#D68240", // Border color change
								"&:hover": {
									backgroundColor: "#fff",
								},
							}}
							onClick={() => handleSizeChange(sizeOption)}
						>
							{sizeOption === "small" && "کوچک"}
							{sizeOption === "medium" && "متوسط"}
							{sizeOption === "large" && "بزرگ"}
						</Button>
					))}
				</Box>
			</Grid>

			<Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
				{/* Quantity Selector */}
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					sx={{ width: "100%" }}
				>
					<Box display="flex" alignItems="center" gap={1}>
						<IconButton
							onClick={() => handleQuantityChange(-1)}
							disabled={quantity[size] === 0}
						>
							<RemoveIcon />
						</IconButton>
						<Typography>{quantity[size]}</Typography>
						<IconButton onClick={() => handleQuantityChange(1)}>
							<AddIcon />
						</IconButton>
					</Box>
					<Typography>
						{(quantity[size] * pricePerItem).toLocaleString()} تومان
					</Typography>
				</Box>

				{/* Add to Cart */}
				<Button variant="contained" color="success" fullWidth>
					مشاهده سبد خرید
				</Button>
			</Grid>

			<Grid>
				<Box
					sx={{
						width: { lg: "500px" },
						// p: { xs: 2, sm: 3 },
						backgroundColor: "white",
						borderRadius: "8px",
					}}
				>
					<Typography
						variant="h6"
						align="center"
						gutterBottom
						sx={{ mb: 3, fontWeight: "bold", pointerEvents: "none" }}
					>
						نظر کاربران
					</Typography>
					<Box
						sx={{
							maxHeight: "700px",
							overflowY: "auto",
							pr: 1,
						}}
					>
						{comments.map((comment) => (
							<Grid
								item
								key={comment.id}
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 1,
									borderBottom: "1px solid #e0e0e0",
									pb: 2,
									mb: 2,
								}}
							>
								<Box display="flex" alignItems="center" gap={1}>
									<Avatar sx={{ bgcolor: "#D68240" }}>
										{comment.name.charAt(0)}
									</Avatar>
									<Box>
										<Typography
											variant="subtitle1"
											sx={{ pointerEvents: "none" }}
										>
											{comment.name}
										</Typography>
										<Typography
											variant="caption"
											color="textSecondary"
											sx={{ pointerEvents: "none" }}
										>
											{comment.date}
										</Typography>
									</Box>
								</Box>
								<Box>
									<Rating
										value={comment.rating}
										readOnly
										precision={0.5}
										sx={{ color: "orange" }}
									/>
								</Box>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ pointerEvents: "none" }}
								>
									{comment.comment}
								</Typography>
							</Grid>
						))}
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default FoodItemPage;
