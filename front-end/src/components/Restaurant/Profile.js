import React, { useState, useEffect } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Avatar,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const RestaurantProfile = () => {
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		fetchProfileData();
	}, []);

	const fetchProfileData = async () => {
		if (!id) {
			console.error("userId is undefined. Cannot fetch profile data.");
			return;
		}

		try {
			const response = await axiosInstance.get(`/restaurant/${id}/profile`);
			const data = response.data;

			if (data) {
				setName(data.name || "");
				const phone = localStorage.getItem("phone");
				setPhoneNumber(phone || "");
			} else {
				console.error("No data received from API");
			}
		} catch (error) {
			console.error("Error fetching profile data:", error);
		}
	};

	const handleProfileEditClick = () => {
		if (id) {
			navigate(`/restaurant/${id}/profileEdit`);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				maxWidth: 450,
				width: "40%",
				margin: "auto",
				mt: 4,
				backgroundColor: "white",
				borderRadius: 2,
				boxShadow: 3,
				p: 2,
				minHeight: "80vh",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					bgcolor: "#f5d5c0",
					width: "100%",
					maxWidth: 400,
					padding: 2,
					borderRadius: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Avatar sx={{ bgcolor: "#f28b82", marginRight: 1 }} />
					<Box>
						<Typography variant="h6">{name}</Typography>
						<Typography variant="body2" color="textSecondary">
							{phoneNumber}
						</Typography>
					</Box>
				</Box>
				<IconButton onClick={handleProfileEditClick}>
					<EditIcon sx={{ color: "#ff7a59", fontSize: 25 }} />
				</IconButton>
			</Box>

			{/* Action Cards */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					maxWidth: 400,
					marginTop: 3,
				}}
			>
				{/* Menu  */}
				<Card
					sx={{
						marginBottom: 2,
						bgcolor: "#f5d5c0",
					}}
				>
					<CardContent sx={{ display: "flex", alignItems: "center" }}>
						<RestaurantMenuIcon sx={{ marginRight: 2, color: "#f28b82" }} />
						<Typography>منوی فروشگاه</Typography>
					</CardContent>
				</Card>

				{/* Financial Report  */}
				<Card sx={{ bgcolor: "#f5d5c0" }}>
					<CardContent sx={{ display: "flex", alignItems: "center" }}>
						<DescriptionIcon sx={{ marginRight: 2, color: "#f28b82" }} />
						<Typography>گزارش مالی فروشگاه</Typography>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default RestaurantProfile;
