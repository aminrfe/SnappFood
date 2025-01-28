import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Stepper,
	Step,
	StepLabel,
	Paper,
	AppBar,
	Toolbar,
} from "@mui/material";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";
import axiosInstance from "../../utills/axiosInstance";
import MotorbikeImage from "../../assets/imgs/motorbike.png";

const TrackOrderPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [activeStep, setActiveStep] = useState(0);

	const steps = [
		"در انتظار تایید",
		"در حال آماده سازی",
		"ارسال شده",
		"تحویل داده شده",
	];

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await axiosInstance.get("/customer/orders");
				// console.log(response.data);
				const fetchedOrder = response.data.find(
					(order) => order.order_id.toString() === id,
				);

				setOrder(fetchedOrder);
				switch (fetchedOrder.state) {
					case "pending":
						setActiveStep(0);
						break;
					case "preparing":
						setActiveStep(1);
						break;
					case "delivering":
						setActiveStep(2);
						break;
					case "completed":
						setActiveStep(3);
						navigate(`/customer/orders/${id}/review`);
						break;
					default:
						setActiveStep(0);
				}
			} catch (error) {
				console.error("خطا در دریافت اطلاعات سفارش:", error);
			}
		};

		fetchOrder();
		const interval = setInterval(fetchOrder, 5000);
		return () => clearInterval(interval);
	}, [id, navigate]);

	if (!order) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
					backgroundColor: "#F5F5F5",
				}}
			>
				<Typography>در حال بارگذاری...</Typography>
			</Box>
		);
	}

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
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					backgroundColor: "#F5F5F5",
					padding: "20px",
				}}
			>
				<Paper
					elevation={3}
					sx={{
						width: "70%",
						textAlign: "center",
						padding: "30px",
						borderRadius: "10px",
						backgroundColor: "#FFEDE0",
					}}
				>
					{/* عنوان */}
					<Typography
						variant="h5"
						fontWeight="bold"
						gutterBottom
						sx={{ fontSize: "1.8rem" }}
					>
						وضعیت سفارش شما
					</Typography>

					{/* اطلاعات */}
					<Typography
						variant="body1"
						gutterBottom
						sx={{
							marginBottom: "40px",
							fontSize: "1.2rem",
						}}
					>
						سفارش شما به ثبت رسید.{" "}
					</Typography>

					{/* تصویر */}
					<Box sx={{ marginY: 3 }}>
						<img
							src={MotorbikeImage}
							alt="Motorbike"
							style={{
								width: "250px",
								height: "auto",
							}}
						/>
					</Box>

					{/* Stepper */}
					<Stepper
						activeStep={activeStep}
						alternativeLabel
						sx={{
							"& .MuiStepConnector-line": {
								borderColor: "#FFA726",
							},
							marginBottom: "40px",
						}}
					>
						{steps.map((label, index) => (
							<Step key={index}>
								<StepLabel
									StepIconProps={{
										sx: {
											color: index <= activeStep ? "#FFA726" : "gray",
										},
									}}
								>
									{label}
								</StepLabel>
							</Step>
						))}
					</Stepper>
				</Paper>
			</Box>
		</Box>
	);
};

export default TrackOrderPage;
