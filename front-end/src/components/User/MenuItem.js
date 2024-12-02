import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	IconButton,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Chip,
	Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Grid from "@mui/material/Grid2";
import Food1 from "../../assets/imgs/food1.png";

const FoodItemPage = () => {
	const [quantity, setQuantity] = useState(1);
	const [size, setSize] = useState("small");
	const pricePerItem = 16000; // Assuming price for one unit

	const handleSizeChange = (newSize) => {
		setSize(newSize);
	};

	const handleQuantityChange = (delta) => {
		setQuantity((prev) => Math.max(prev + delta, 1));
	};

	return (
		<Box sx={{ p: 2 }}>
			{/* Food Image and Details */}
			<div>
				<Grid>
					<img
						src={Food1}
						alt="Foof Image"
						style={{
							// marginRight: "15vw",
							height: "300px",
						}}
					/>
					<Grid
						// display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="h6">اسم غذای نمونه</Typography>
						<IconButton color="error">
							<FavoriteBorderIcon />
						</IconButton>
					</Grid>
					<Typography variant="subtitle1" color="textSecondary">
						اسم رستوران نمونه
					</Typography>
					<Typography variant="body2" sx={{ my: 1 }}>
						مخلفات غذای نمونه لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
						صنعت چاپ است.
					</Typography>
					<Box gap={2} alignItems="center">
						<Chip label="۴.۷" color="primary" />
						<Typography variant="body2">۲۰ دقیقه</Typography>
						<Typography variant="body2">رایگان</Typography>
					</Box>
				</Grid>
				<Divider />
				<CardActions sx={{ flexDirection: "column", gap: 2 }}>
					{/* Size Selector */}
					<Box display="flex" justifyContent="center" gap={1}>
						{["small", "medium", "large"].map((sizeOption) => (
							<Button
								key={sizeOption}
								variant={size === sizeOption ? "contained" : "outlined"}
								color={size === sizeOption ? "primary" : "default"}
								onClick={() => handleSizeChange(sizeOption)}
							>
								{sizeOption === "small" && "کوچک"}
								{sizeOption === "medium" && "متوسط"}
								{sizeOption === "large" && "بزرگ"}
							</Button>
						))}
					</Box>

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
								disabled={quantity === 1}
							>
								<RemoveIcon />
							</IconButton>
							<Typography>{quantity}</Typography>
							<IconButton onClick={() => handleQuantityChange(1)}>
								<AddIcon />
							</IconButton>
						</Box>
						<Typography>
							{(quantity * pricePerItem).toLocaleString()} تومان
						</Typography>
					</Box>

					{/* Add to Cart */}
					<Button variant="contained" color="success" fullWidth>
						اضافه کردن به سبد
					</Button>
				</CardActions>
			</div>
		</Box>
	);
};

export default FoodItemPage;
