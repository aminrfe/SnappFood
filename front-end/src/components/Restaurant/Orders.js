import React, { useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const orders = [
	{
		id: 1,
		name: "سفارش شماره یک",
		date: "پنجشنبه 15 تیر",
		time: "18:07",
		price: "365,500 تومان",
		items: ["محصول ۱", "محصول ۲", "محصول ۳"],
	},
	{
		id: 2,
		name: "سفارش شماره دو",
		date: "پنجشنبه 15 تیر",
		time: "18:07",
		price: "365,500 تومان",
		items: ["محصول ۴", "محصول ۵"],
	},
	{
		id: 3,
		name: "سفارش شماره سه",
		date: "پنجشنبه 15 تیر",
		time: "18:07",
		price: "365,500 تومان",
		items: ["محصول ۶"],
	},
];

const OrderList = () => {
	const [open, setOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [status, setStatus] = useState("");
	const [orderStatuses, setOrderStatuses] = useState({});

	const handleOpenDialog = (order) => {
		console.log("Opening dialog for order:", order);
		setSelectedOrder(order);
		setOpen(true);
		setStatus(orderStatuses[order.id] || "");
	};

	const handleCloseDialog = () => {
		if (selectedOrder) {
			setOrderStatuses((prev) => ({ ...prev, [selectedOrder.id]: status }));
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
				justifyContent: "center",
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

			{orders.map((order) => (
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
								{order.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{order.date} - {order.time}
							</Typography>
						</Box>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-end",
								textAlign: "right",
							}}
						>
							<Typography variant="body1" sx={{ fontWeight: "bold" }}>
								{order.price}
							</Typography>
							<Typography
								variant="body2"
								color="primary"
								sx={{ marginBottom: "1rem" }}
							>
								{orderStatuses[order.id] &&
									`آخرین وضعیت: ${orderStatuses[order.id]}`}
							</Typography>
						</Box>
					</AccordionSummary>
					<AccordionDetails
						sx={{ backgroundColor: "#FFF8F1", boxShadow: "none" }}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%",
							}}
						>
							{/* Left Side Content */}
							<Box>
								<Typography variant="body2" sx={{ marginBottom: "1rem" }}>
									جزئیات سفارش:
								</Typography>
								<ul>
									{order.items.map((item, index) => (
										<li key={index}>
											<Typography variant="body2">{item}</Typography>
										</li>
									))}
								</ul>
							</Box>

							{/* Right Side Button */}
							<Button
								variant="contained"
								onClick={() => handleOpenDialog(order)}
								sx={{
									fontWeight: "normal !important",
									border: "1px solid #d68240",
									alignSelf: "flex-start", // Align to the top if content height differs
								}}
							>
								وارد کردن وضعیت سفارش
							</Button>
						</Box>
					</AccordionDetails>
				</Accordion>
			))}

			{/* Dialog Component */}
			<Dialog
				open={open}
				onClose={handleCloseDialog}
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
