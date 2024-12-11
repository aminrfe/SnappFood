import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	IconButton,
	Tabs,
	Tab,
	TextField,
	Card,
	CardMedia,
	CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Food1 from "../../assets/imgs/food1.png";
import Food2 from "../../assets/imgs/food2.png";
import Food3 from "../../assets/imgs/food3.png";
import Food4 from "../../assets/imgs/food4.png";

const EditMenu = () => {
	const categories = [
		{ id: 1, name: "غذای ۱" },
		{ id: 2, name: "غذای ۲" },
		{ id: 3, name: "غذای ۳" },
		{ id: 4, name: "غذای ۴" },
	];

	const initialFoodData = {
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

	const [foodData, setFoodData] = useState(initialFoodData);
	const [selectedCategory, setSelectedCategory] = useState(1);
	const [editingFood, setEditingFood] = useState(null);

	const handleChange = (event, newValue) => {
		setSelectedCategory(newValue);
		setEditingFood(null);
	};

	const handleDelete = (foodId) => {
		setFoodData((prevData) => {
			const updatedCategory = prevData[selectedCategory].filter(
				(food) => food.id !== foodId,
			);
			return { ...prevData, [selectedCategory]: updatedCategory };
		});
	};

	const handleEditClick = (food) => {
		setEditingFood(food);
	};

	const handleEditChange = (field, value) => {
		setEditingFood((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		setFoodData((prevData) => {
			const updatedCategory = prevData[selectedCategory].map((food) =>
				food.id === editingFood.id ? editingFood : food,
			);
			return { ...prevData, [selectedCategory]: updatedCategory };
		});
		setEditingFood(null);
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
				alignItems: "start",
				justifyContent: "center",
			}}
		>
			{/* Edit Food Form */}
			{editingFood && (
				<Grid>
					<Box
						sx={{
							p: 2,
							border: "1px solid gray",
							borderRadius: 3,
							width: { xs: "100%", md: "300px" },
						}}
					>
						<Typography variant="h6" sx={{ mb: 2, pointerEvents: "none" }}>
							ویرایش غذا
						</Typography>
						<Box sx={{ mb: 2 }}>
							<Typography variant="body2" sx={{ mb: 1 }}>
								تصویر فعلی:
							</Typography>
							<CardMedia
								component="img"
								image={editingFood.image}
								alt="current food image"
								sx={{ width: "100%", borderRadius: 3 }}
							/>
						</Box>
						<Box sx={{ mb: 2 }}>
							<Typography variant="body2" sx={{ mb: 1 }}>
								آپلود تصویر جدید:
							</Typography>
							<input
								type="file"
								dir="ltr"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files[0];
									if (file) {
										const imageUrl = URL.createObjectURL(file);
										handleEditChange("image", imageUrl);
									}
								}}
							/>
						</Box>
						<TextField
							fullWidth
							label="نام غذا"
							value={editingFood.name}
							onChange={(e) => handleEditChange("name", e.target.value)}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="توضیحات"
							value={editingFood.description}
							onChange={(e) => handleEditChange("description", e.target.value)}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="قیمت"
							value={editingFood.price}
							onChange={(e) => handleEditChange("price", e.target.value)}
							sx={{ mb: 2 }}
						/>
						<Button fullWidth variant="contained" onClick={handleSave}>
							ذخیره
						</Button>
					</Box>
				</Grid>
			)}
			{/* Food List */}
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

					<Box sx={{ cursor: "pointer" }}>
						{foodData[selectedCategory].length > 0 ? (
							foodData[selectedCategory].map((food) => (
								<Card
									key={food.id}
									sx={{
										display: "flex",
										alignItems: "center",
										mb: 2,
										boxShadow: "none",
										paddingBottom: 2,
										borderRadius: 0,
										borderBottom: "1px solid gray",
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
											sx={{ paddingTop: 2, pointerEvents: "none" }}
										>
											{food.price} تومان
										</Typography>
									</CardContent>
									<Box>
										<IconButton onClick={() => handleEditClick(food)}>
											<EditIcon color="primary" />
										</IconButton>
										<IconButton onClick={() => handleDelete(food.id)}>
											<DeleteIcon color="error" />
										</IconButton>
									</Box>
								</Card>
							))
						) : (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ textAlign: "center", pointerEvents: "none" }}
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

export default EditMenu;
