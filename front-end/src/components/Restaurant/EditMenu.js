import React, { useState, useEffect } from "react";
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
import axiosInstance from "../../utills/axiosInstance";
import { useParams } from "react-router-dom";

const EditMenu = () => {
	const { res_id } = useParams(); 
	const restaurantId = parseInt(res_id);
	const [foodData, setFoodData] = useState([]);
	const [editingFood, setEditingFood] = useState(null);
	const [isAddingNew, setIsAddingNew] = useState(false);


	useEffect(() => {
		const fetchFoodData = async () => {
			try {
				const response = await axiosInstance.get(`/restaurant/items`);
				const allData = response.data;
				console.log(allData);

            	const filteredData = allData.filter((item) => item.restaurant === parseInt(res_id));
            	setFoodData(filteredData);
			} catch (error) {
				console.error("خطا در دریافت داده‌ها:", error.response?.data || error.message);
				alert("خطا در دریافت داده‌ها.");
			}
		};

		fetchFoodData();
	}, [res_id]);

	const handleEditChange = (field, value) => {
		setEditingFood((prev) => ({ ...prev, [field]: value }));
	};

	
	const handleDelete = async (foodId) => {
		try {
			await axiosInstance.delete(`/restaurant/items/${foodId}`);
	
			setFoodData((prevData) => prevData.filter((food) => food.item_id !== foodId))
			alert("آیتم با موفقیت حذف شد.");
			setEditingFood(null); 
			setIsAddingNew(false);
			
		} catch (error) {
			console.error("خطا در حذف آیتم:", error.response?.data || error.message);
			alert("حذف آیتم با خطا مواجه شد.");
		}
	};

	const handleEditClick = async (foodId) => {
		try {
			// console.log("B",foodData);
			const response = await axiosInstance.get(`/restaurant/items/${foodId}`);
			setEditingFood({
				item_id: response.data.item_id,
				name: response.data.name,
				description: response.data.description,
				price: response.data.price,
				photo: response.data.photo,
				discount: response.data.discount,
				score: response.data.score,
				state: response.data.state,
			});
			setIsAddingNew(false);
		} catch (error) {
			console.error("خطا در دریافت جزئیات آیتم:", error.response?.data || error.message);
			alert("خطا در دریافت جزئیات آیتم.");
		}
	};

	const handleAddClick = () => {
		setEditingFood({
			item_id: "",
			name: "",
			description: "",
			price: "",
			photo: "",
			discount: "",
			score: 0,
			state: ""
		});
		setIsAddingNew(true); 
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			handleEditChange("photo", imageUrl); 
			handleEditChange("imageFile", file); 
		}
	};

	const handleSave = async () => {
		if (!editingFood.name || !editingFood.price || !editingFood.description) {
			alert("لطفاً همه فیلدهای ضروری را پر کنید.");
			return;
		}

		const formData = new FormData();

		formData.append("price", editingFood.price);
		formData.append("name", editingFood.name);
		formData.append("description", editingFood.description);
		formData.append("discount", (editingFood.discount).toString() || "0"); 
		formData.append("state", "available");
		formData.append("score", 0);

		if (editingFood.imageFile) {
			formData.append("photo", editingFood.imageFile);
		}

		try {
			if (isAddingNew) {
				const response = await axiosInstance.post(
					"/restaurant/items",
					formData,
					{
						headers: { "Content-Type": "multipart/form-data" },
					}
				);
			
				const newItem = {
					...editingFood,
					item_id: response.data.item_id, // مقدار id به‌درستی تنظیم می‌شود
				};
			
				setFoodData((prevData) => [...prevData, newItem]);
				alert("آیتم جدید با موفقیت اضافه شد.");
				setEditingFood(newItem); // تنظیم دوباره editingFood با id صحیح
			}
			else {
				if (!editingFood.item_id) {
					alert("آیتم نامعتبر است، دوباره امتحان کنید.");
					return;
				}
		
				await axiosInstance.put(
					`/restaurant/items/${editingFood.item_id}`,
					formData,
					{
						headers: { "Content-Type": "multipart/form-data" },
					}
				);
		
				const response = await axiosInstance.get("/restaurant/items");
				setFoodData(response.data);
				setEditingFood(null);
		
				alert("آیتم با موفقیت ویرایش شد.");
			}
		} catch (error) {
			console.error("خطا در ذخیره آیتم:", error.response?.data || error.message);
			alert("ذخیره آیتم با خطا مواجه شد.");
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
							{editingFood.photo && (
								<CardMedia
									component="img"
									image={editingFood.photo}
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
							label="قیمت (به تومان)"
							value={parseInt(editingFood.price)}
							type="number" 
							onChange={(e) => handleEditChange("price", e.target.value)}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="درصد تخفیف"
							value={editingFood.discount}
							type="number" 
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
									key={food.item_id}
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
										image={food.photo}
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
											{parseInt(food.price)} تومان
										</Typography>
									</CardContent>
									<Box>
									<IconButton onClick={() => handleEditClick(food.item_id)}>
										<EditIcon color="primary" />
	    							</IconButton>
	    							<IconButton onClick={() => handleDelete(food.item_id)}>
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
