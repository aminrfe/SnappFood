import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	IconButton,
	TextField,
	Card,
	CardMedia,
	CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Food1 from "../../assets/imgs/food1.png";
import Food2 from "../../assets/imgs/food2.png";
import Food3 from "../../assets/imgs/food3.png";
import Food4 from "../../assets/imgs/food4.png";
import axiosInstance from "../../utills/axiosInstance";
import { useParams } from "react-router-dom";

const EditMenu = () => {
	const { res_id } = useParams(); 
	console.log("res_id:", res_id);

	const initialFoodData = [
		{
			id: 1,
			name: "اسم غذای نمونه ۱",
			description: "توضیحات نمونه ۱",
			price: "۳۴۰۰۰۰",
			image: Food1,
			discount: "0",
		},
		{
			id: 2,
			name: "اسم غذای نمونه ۲",
			description: "توضیحات نمونه ۲",
			price: "۴۵۰۰۰۰",
			image: Food2,
			discount: "0",
		},
		{
			id: 3,
			name: "اسم غذای نمونه ۳",
			description: "توضیحات نمونه ۳",
			price: "۲۱۰۰۰۰",
			image: Food3,
			discount: "0",
		},
		{
			id: 4,
			name: "اسم غذای نمونه ۴",
			description: "توضیحات نمونه ۴",
			price: "۱۸۰۰۰۰",
			image: Food4,
			discount: "0",
		},
	];

	const [foodData, setFoodData] = useState(initialFoodData);
	const [editingFood, setEditingFood] = useState(null);
	const [isAddingNew, setIsAddingNew] = useState(false);

	// افزودن فایل تصویر واقعی
	const handleEditChange = (field, value) => {
		setEditingFood((prev) => ({ ...prev, [field]: value }));
	};

	
	const handleDelete = (foodId) => {
		setFoodData((prevData) => prevData.filter((food) => food.id !== foodId));
	};

	const handleEditClick = (food) => {
		setEditingFood(food);
		setIsAddingNew(false); // بستن حالت افزودن
	};

	const handleAddClick = () => {
		setEditingFood({
			id: null,
			name: "",
			description: "",
			price: "",
			image: "",
			discount: ""
			// score: 0
		});
		setIsAddingNew(true); // حالت افزودن
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file); // پیش‌نمایش تصویر
			handleEditChange("image", imageUrl); // نمایش پیش‌نمایش
			handleEditChange("imageFile", file); // ذخیره فایل واقعی
		}
	};

	const handleSave = async () => {
		if (!editingFood.name || !editingFood.price || !editingFood.description) {
			alert("لطفاً همه فیلدهای ضروری را پر کنید.");
			return;
		}

		// const score = editingFood.score !== undefined ? editingFood.score : "0";
		const formData = new FormData();

		formData.append("price", parseFloat(editingFood.price)); // تبدیل به عدد
		formData.append("name", editingFood.name);
		formData.append("description", editingFood.description);
		formData.append("discount", parseFloat(editingFood.discount) || 0); // مقدار پیش‌فرض 0
		formData.append("state", "available");
		// formData.append("score", "0");

		// اضافه کردن فایل تصویر در صورت انتخاب
		if (editingFood.imageFile) {
			formData.append("photo", editingFood.imageFile); // فایل تصویر واقعی
		}

		try {
			const response = await axiosInstance.post(
				`/restaurant/${res_id}/items`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data", // تنظیم Content-Type
					},
				}
			);

			setFoodData((prevData) => [
				...prevData,
				{ ...editingFood, id: response.data.id },
			]);

			alert("آیتم جدید با موفقیت اضافه شد.");
			setEditingFood(null); // بازنشانی فرم
			setIsAddingNew(false); // خروج از حالت افزودن
		} catch (error) {
			console.error("خطا در افزودن آیتم:", error.response?.data || error.message);
			alert("افزودن آیتم با خطا مواجه شد.");
		}
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
			{/* Edit/Add Food Form */}
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
							{isAddingNew ? "اضافه کردن غذای جدید" : "ویرایش غذا"}
						</Typography>
						<Box sx={{ mb: 2 }}>
							<Typography variant="body2" sx={{ mb: 1 }}>
								تصویر:
							</Typography>
							{editingFood.image && (
								<CardMedia
									component="img"
									image={editingFood.image}
									alt="food image"
									sx={{ width: "100%", borderRadius: 3, mb: 2 }}
								/>
							)}
							<input
								type="file"
								dir="ltr"
								accept="image/*"
								onChange={handleFileUpload}
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
							onChange={(e) =>
								handleEditChange("description", e.target.value)
							}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="قیمت"
							value={editingFood.price}
							type="number" // فقط ورودی عدد مجاز باشد
							onChange={(e) => handleEditChange("price", e.target.value)}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="درصد تخفیف"
							value={editingFood.discount}
							type="number" // فقط ورودی عدد مجاز باشد
							onChange={(e) => handleEditChange("discount", e.target.value)}
							sx={{ mb: 2 }}
						/>

						<Button fullWidth variant="contained" onClick={handleSave}>
							{isAddingNew ? "اضافه کردن" : "ذخیره"}
						</Button>
					</Box>
				</Grid>
			)}

			{/* Food List */}
			<Grid>
				<Box sx={{ width: { lg: "700px" } }}>
					{/* Add Button */}
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							mb: 2,
						}}
					>
					</Box>
					{/* Food Items */}
					<Box sx={{ cursor: "pointer" }}>
						{foodData.length > 0 ? (
							foodData.map((food) => (
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
								هیچ غذایی وجود ندارد.
							</Typography>
						)}
					</Box>
					<Button
							variant="contained"
							color="primary"
							startIcon={<AddIcon />}
							onClick={handleAddClick}
							style={{padding:"10px"}}
						>
							اضافه کردن غذا
					</Button>
				</Box>
			</Grid>
		</Grid>
	);
};

export default EditMenu;
