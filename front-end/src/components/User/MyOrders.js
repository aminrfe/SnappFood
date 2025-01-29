import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Toolbar,
	AppBar,
	Button,
	Card,
	CardContent,
	CardActions,
	Collapse,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import moment from "moment-jalaali";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const deliveryMethodMap = {
	pickup: "دریافت حضوری",
	delivery: "ارسال با پیک",
};

const paymentMethodMap = {
	in_person: "نقدی",
	online: "آنلاین",
};

const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState(null);
	const [openIndex, setOpenIndex] = useState(null); // To track the open collapse
	const navigate = useNavigate();

	useEffect(() => {
		axiosInstance
			.get("/customer/orders")
			.then((response) => {
				console.log("Fetched Orders:", response.data);
				setOrders(response.data);
			})
			.catch((err) => {
				setError("خطا در بارگذاری سفارش‌ها");
			});
	}, []);

	const handleCollapseToggle = (index) => {
		setOpenIndex(openIndex === index ? null : index); // Toggle collapse
	};

	return (
		<Box sx={{ padding: 0 }}>
			<AppBar
				position="static"
				sx={{
					backgroundColor: "#F4DCC9",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
				}}
			>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<a
						href="/"
						onClick={(e) => {
							e.preventDefault();
							navigate("/");
						}}
					>
						<img
							src={FoodiLogo}
							alt="Foodi Logo"
							style={{ width: "100px", cursor: "pointer" }}
						/>
					</a>
					<Typography
						variant="h6"
						sx={{
							color: "#D68240",
							fontWeight: "bold",
							flex: 1,
							textAlign: "center",
							userSelect: "none",
							pointerEvents: "none",
							paddingRight: "50px",
						}}
					>
						سفارش‌های من
					</Typography>
					<Box />
				</Toolbar>
			</AppBar>

			<Grid container spacing={2} justifyContent="center" padding="20px">
				{orders.length === 0 ? (
					<Typography
						variant="h6"
						color="text.secondary"
						style={{ marginTop: "50px", marginRight: "25px" }}
					>
						لیست سفارش‌های شما خالی است.
					</Typography>
				) : (
					orders.map((order, index) => (
						<Card
							key={order.id}
							sx={{
								flexDirection: "column",
								marginBottom: "1rem",
								width: "70%",
								backgroundColor: "#FFF5ED",
								boxShadow: 2,
								borderRadius: 2,
								display: "flex",
								position: "relative",
								overflow: "hidden",
							}}
						>
							<CardContent
								sx={{
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									justifyContent: "space-between",
									alignItems: "center",
									gap: 2,
								}}
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										flexGrow: 1,
										alignItems: "flex-start",
									}}
								>
									<Typography
										variant="h6"
										fontWeight="bold"
										sx={{ marginBottom: 1, color: "#333" }}
									>
										سفارش شماره {order.order_id}
									</Typography>
									<Typography
										variant="h7"
										fontWeight="bold"
										sx={{ marginBottom: 1, color: "#333" }}
									>
										{order.restaurant_name}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ marginBottom: 3 }}
									>
										{order.description}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ marginBottom: 1 }}
									>
										تاریخ سفارش:{" "}
										{moment(order.order_date).format("jYYYY/jMM/jDD")} در ساعت{" "}
										{moment(order.order_date).format("HH:mm")}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ marginBottom: 1 }}
									>
										آدرس: {order.address}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ marginBottom: 1 }}
									>
										روش ارسال: {deliveryMethodMap[order.delivery_method]}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ marginBottom: 2 }}
									>
										روش پرداخت: {paymentMethodMap[order.payment_method]}
									</Typography>
									<Typography
										variant="body1"
										fontWeight="bold"
										sx={{ color: "#D68240", marginBottom: 1 }}
									>
										قیمت کل: {Math.floor(order.total_price).toLocaleString()}{" "}
										تومان
									</Typography>
								</Box>

								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 1,
										flexShrink: 0,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									{order.state === "completed" ? (
										<Button
											variant="contained"
											disabled
											sx={{
												width: "122px",
											}}
										>
											تحویل شده
										</Button>
									) : (
										<Button
											sx={{
												width: "122px",
											}}
											variant="contained"
											onClick={(event) => {
												event.stopPropagation();
												navigate(
													`/customer/orders/${order.order_id}/track-order`,
												);
											}}
										>
											پیگیری سفارش
										</Button>
									)}
									<Button
										sx={{
											width: "122px",
										}}
										variant="contained"
										onClick={(event) => {
											event.stopPropagation();
											navigate(`/customer/restaurants/${order.restaurant}`);
										}}
									>
										سفارش مجدد
									</Button>
								</Box>
							</CardContent>

							<CardActions>
								<Button
									onClick={() => handleCollapseToggle(index)}
									sx={{
										background: "linear-gradient(90deg, #FF8A00, #D68240)",
										color: "white",
										padding: "6px 12px",
										borderRadius: "4px",
										"&:hover": {
											background: "linear-gradient(90deg, #D68240, #FF8A00)",
										},
									}}
								>
									<ExpandMoreIcon />
								</Button>
							</CardActions>

							<Collapse in={openIndex === index} timeout="auto" unmountOnExit>
								<CardContent>
									<Box>
										<Typography
											variant="body1"
											sx={{
												fontWeight: "bold",
												marginBottom: "0.5rem",
												fontSize: { xs: "0.875rem", sm: "1rem" },
											}}
										>
											آیتم‌های سفارش:
										</Typography>
										<List>
											{order.order_items.map((item, idx) => (
												<ListItem
													key={idx}
													sx={{
														paddingLeft: 0,
														fontSize: { xs: "0.75rem", sm: "0.875rem" },
													}}
												>
													<ListItemText
														primary={`${item.name} - تعداد: ${item.count}`}
														sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
													/>
												</ListItem>
											))}
										</List>
									</Box>
								</CardContent>
							</Collapse>
						</Card>
					))
				)}
			</Grid>
		</Box>
	);
};

export default MyOrders;
