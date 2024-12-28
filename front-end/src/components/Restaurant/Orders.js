import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Dialog,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../utills/axiosInstance";


const OrderList = () => {

	// const orders = [
	// 	{
	// 		id: 1,
	// 		order_date: "پنجشنبه 15 تیر - ساعت 19:43:21",
	// 		delivery_method: "پیک",
	// 		payment_method: "آنلاین",
	// 		address: "خیابان آزادی، پلاک ۱۲۳",
	// 		status: "در حال آماده سازی",
	// 		total_price: "۳۵۰,۰۰۰ تومان",
	// 		description: "این سفارش باید سریع تحویل داده شود.",
	// 		order_items: [
	// 			{ name: "محصول ۱", count: 2 },
	// 			{ name: "محصول ۲", count: 1 },
	// 		],
	// 	},
	// 	{
	// 		id: 2,
	// 		order_date: "شنبه 17 تیر - ساعت 21:31:09",
	// 		delivery_method: "حضوری",
	// 		payment_method: "درب منزل",
	// 		address: "خیابان ولیعصر، پلاک ۴۵۶",
	// 		status: "در حال آماده سازی",
	// 		total_price: "۲۰۰,۰۰۰ تومان",
	// 		description: "به همراه یک پک قاشق اضافه ارسال شود.",
	// 		order_items: [{ name: "محصول ۳", count: 1 }],
	// 	},
	// ];


	const [orders, setOrders] = useState([]); 
	const [open, setOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [status, setStatus] = useState("");
	const [orderStatuses, setOrderStatuses] = useState({});

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await axiosInstance.get("/restaurant/orders");
				const ordersWithId = response.data.map((order, index) => ({
					...order,
					id: index + 1,
				}));
				setOrders(ordersWithId);
			} catch (err) {
				console.log("خطا در دریافت اطلاعات");
			}
		};
		fetchOrders();
	}, []);
	

	const handleOpenDialog = (order) => {
		setSelectedOrder(order);
		setOpen(true);
		setStatus(orderStatuses[order.id] || "");
	};

	const handleCloseDialog = async () => {
		if (selectedOrder) {
			try {
				await axiosInstance.patch(`/restaurant/orders/${selectedOrder.id}/status`, {
					state: status,
				});
				setOrderStatuses((prev) => ({ ...prev, [selectedOrder.id]: status }));
			} catch (err) {
				console.error("خطا در به‌روزرسانی وضعیت سفارش:", err);
			}
		}
		setOpen(false);
		setStatus("");
	};

	return (
		<Box
			sx={{
				backgroundColor: "#FFFFFF",
				padding: "2rem",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography
				variant="h5"
				align="center"
				gutterBottom
				sx={{ fontWeight: "bold", marginBottom: "2rem" }}
			>
				لیست سفارش‌ها
			</Typography>

			{orders.length === 0 ? (
				<Typography variant="h6" color="text.secondary">
					سفارشی در لیست شما وجود ندارد
				</Typography>
			) : (
				orders.map((order, index) => (
					<Accordion
						key={order.id}
						sx={{ marginBottom: "1rem", width: "900px", boxShadow: "none" }}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							sx={{
								backgroundColor: "#F4DCC9",
								padding: "1rem",
								alignItems: "center",
								display: "flex",
								justifyContent: "space-between",
								paddingRight: "20px",
								borderRadius: "20px",
							}}
						>
							<Box sx={{ flexGrow: 1, textAlign: "left" }}>
								<Typography variant="h6" sx={{ fontWeight: "bold" }}>
									سفارش شماره {index + 1}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									تاریخ سفارش: {order.order_date}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									روش ارسال: {order.delivery_method}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									روش پرداخت: {order.payment_method}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									آدرس: {order.address}
								</Typography>
								<Typography variant="body2" color="primary">
									وضعیت فعلی: {orderStatuses[order.id] || order.status}
								</Typography>
								</Box>
									<Box>
									<Typography
									variant="body1"
									sx={{ fontWeight: "bold", marginBottom: "1rem" }}
									>
										قیمت کل: {order.total_price}
									</Typography>
									<Button
										variant="contained"
										onClick={() => handleOpenDialog(order)}
										sx={{
											fontWeight: "normal",
											border: "1px solid #d68240",
											"&:hover": {
												color: "#d68240",
											},
										}}
									>
										وارد کردن وضعیت سفارش
									</Button>
								</Box>
						</AccordionSummary>
						<AccordionDetails
							sx={{ backgroundColor: "#FFF8F1", boxShadow: "none" }}
						>
							<Typography
								variant="body1"
								sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
							>
								آیتم‌های سفارش:
							</Typography>
							<List>
								{order.order_items.map((item, idx) => (
									<ListItem key={idx} sx={{ paddingLeft: 0 }}>
										<ListItemText
											primary={`${item.name} - تعداد: ${item.count}`}
										/>
									</ListItem>
								))}
							</List>
							<Typography
								variant="body1"
								sx={{ fontWeight: "bold", marginTop: "0.5rem" }}
							>
								توضیحات سفارش:
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{order.description || "بدون توضیحات"}
							</Typography>
						</AccordionDetails>
					</Accordion>
				))
			)}

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				BackdropProps={{
					style: {
						backgroundColor: "rgba(0, 0, 0, 0.4)",
						backdropFilter: "blur(5px)",
					},
				}}
				PaperProps={{
					sx: {
						borderRadius: "12px",
						padding: "1.5rem",
						minWidth: "300px",
						backgroundColor: "#FFF8F1",
					},
				}}
			>
				<Box>
					<Typography
						variant="h6"
						sx={{
							fontWeight: "bold",
							marginBottom: "1rem",
							textAlign: "center",
						}}
					>
						وضعیت این سفارش را وارد کنید.
					</Typography>

					<FormControl fullWidth>
						<InputLabel>وضعیت سفارش</InputLabel>
						<Select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							label="وضعیت سفارش"
							sx={{
								backgroundColor: "#FFEBE1",
								borderRadius: "8px",
								marginBottom: "1rem",
							}}
						>
							<MenuItem value="در حال آماده سازی">در حال آماده سازی</MenuItem>
							<MenuItem value="ارسال شده">ارسال شده</MenuItem>
							<MenuItem value="تحویل داده شده">تحویل داده شده</MenuItem>
						</Select>
					</FormControl>

					<Button variant="contained" fullWidth onClick={handleCloseDialog}>
						تایید
					</Button>
				</Box>
			</Dialog>
		</Box>
	);
};

export default OrderList;