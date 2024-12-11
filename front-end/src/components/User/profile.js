import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));

	const handleEditClick = () => {
		navigate("/user-edit-profile");
	};

	const handleSignUpClick = () => {
		navigate("/restuarant-signup");
	};

	return (
		<Box
			sx={{
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
			{/* Profile Header */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					backgroundColor: "#ffe5d4",
					p: 2,
					borderRadius: 2,
				}}
			>
				<AccountCircleIcon sx={{ fontSize: 48, color: "#ff7a59" }} />
				<Box sx={{ marginLeft: "4px" }}>
					<Typography
						variant="h6"
						fontWeight="bold"
						sx={{
							pointerEvents: "none",
							userSelect: "none",
							fontSize: "1.2rem",
						}}
					>
						{user.user.first_name + " " + user.user.last_name ||
							"نام و نام خانوادگی"}
					</Typography>
					<Typography
						variant="body2"
						color="textSecondary"
						sx={{ pointerEvents: "none", userSelect: "none" }}
					>
						{" "}
						{user.user.phone_number || "شماره تلفن"}
					</Typography>
				</Box>
				<IconButton sx={{ ml: 2 }} onClick={handleEditClick}>
					<EditIcon sx={{ color: "#ff7a59", fontSize: 25 }} />
				</IconButton>
			</Box>

			{/* Options List */}
			<List
				sx={{
					backgroundColor: "#ffeddf",
					borderRadius: 2,
					mt: 2,
					p: 1,
				}}
			>
				<ListItem
					button
					style={{ cursor: "pointer" }}
					sx={{ paddingRight: 2, paddingLeft: 2 }}
				>
					<ListItemIcon>
						<ShoppingBagIcon color="warning" />
					</ListItemIcon>
					<ListItemText primary="سفارش‌های من" />
				</ListItem>
				<Divider
					sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }}
				/>
				<ListItem
					button
					style={{ cursor: "pointer" }}
					sx={{ paddingRight: 2, paddingLeft: 2 }}
				>
					<ListItemIcon>
						<FavoriteIcon color="warning" />
					</ListItemIcon>
					<ListItemText primary="لیست علاقه‌مندی‌ها" />
				</ListItem>
				<Divider
					sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }}
				/>
				<ListItem
					button
					style={{ cursor: "pointer" }}
					sx={{ paddingRight: 2, paddingLeft: 2 }}
				>
					<ListItemIcon>
						<AssignmentIcon color="warning" />
					</ListItemIcon>
					<ListItemText
						onClick={handleSignUpClick}
						primary="ثبت نام فروشندگان"
					/>
				</ListItem>
			</List>
		</Box>
	);
};

export default UserProfilePage;
