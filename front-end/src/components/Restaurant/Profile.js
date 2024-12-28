import React, { useState, useEffect } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Avatar,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const RestaurantProfile = () => {
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	console.log(id);  // Check if id is logged properly
    return <div>Restaurant {id}</div>;

	useEffect(() => {
		fetchProfileData();
	}, []);

	const fetchProfileData = async () => {
		if (!id) {
			console.error("userId is undefined. Cannot fetch profile data.");
			return;
		}

		try {
			const response = await axiosInstance.get(`/restaurant/profiles/me`);
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

	const handleMenuClick = () => {
		if (id) {
			navigate(`/restaurant/${id}/menu`);
		}
	};

	const handleOpenLogoutDialog = () => {
		setOpenLogoutDialog(true);
	};

	const handleCloseLogoutDialog = () => {
		setOpenLogoutDialog(false);
	};

	const handleLogOutClick = () => {
		localStorage.clear();
		navigate("/");
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
						<Typography 
						variant="h6"
						sx={{ pointerEvents: "none", userSelect: "none" }}>
							{name}</Typography>
						<Typography 
						variant="body2" color="textSecondary"
						sx={{ pointerEvents: "none", userSelect: "none" }}>
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
				<Card
					sx={{
						marginBottom: 2,
						bgcolor: "#f5d5c0",
					}}
				>
					<CardContent 
					style={{ cursor: "pointer" }}
					sx={{ display: "flex", alignItems: "center" }}
					onClick={handleMenuClick}
					>
						<RestaurantMenuIcon sx={{ marginRight: 2, color: "#f28b82" }} />
						<Typography>منوی فروشگاه</Typography>
					</CardContent>
				</Card>

				<Card
					sx={{
						marginBottom: 2,
						bgcolor: "#f5d5c0",
					}}
				>
					<CardContent 
					style={{ cursor: "pointer" }}
					onClick={() => navigate("/restaurant-orders")}
					sx={{ display: "flex", alignItems: "center" }}>
						<ShoppingBagIcon sx={{ marginRight: 2, color: "#f28b82" }} />
						<Typography>سفارش های فروشگاه</Typography>
					</CardContent>
				</Card>

				<Card 
					sx={{
						marginBottom: 2,
						bgcolor: "#f5d5c0",
					}}
				>
					<CardContent 
					style={{ cursor: "pointer" }}
					sx={{ display: "flex", alignItems: "center" }}
					onClick={() => navigate("/restaurant-report")}>
						<DescriptionIcon sx={{ marginRight: 2, color: "#f28b82" }} />
						<Typography>گزارش مالی فروشگاه</Typography>
					</CardContent>
				</Card>

				<Card sx={{ bgcolor: "#f5d5c0" }}>
					<CardContent 
					style={{ cursor: "pointer" }}
					onClick={handleOpenLogoutDialog}
					sx={{ display: "flex", alignItems: "center" }}>
						<LogoutIcon sx={{ marginRight: 2, color: "#f28b82" }} />
						<Typography>خروج از حساب کاربری</Typography>
					</CardContent>
				</Card>
				
			</Box>

			<Dialog
  				open={openLogoutDialog}
  				onClose={handleCloseLogoutDialog}
  				aria-labelledby="logout-dialog-title"
  				aria-describedby="logout-dialog-description"
  				sx={{
  				  "& .MuiDialog-paper": {
  				    padding: "15px 16px", 
  				    borderRadius: "12px",
  				  },
  				}}
			>
			<DialogTitle
			  id="logout-dialog-title"
			  sx={{
				  padding: "10px 8px", 
			    fontSize: "18px", 
				pointerEvents: "none", 
				userSelect: "none"
			  }}
			>
    		تأیید خروج
  			</DialogTitle>
  			<DialogContent
  			  sx={{
  			    padding: "8px 8px",
				pointerEvents: "none", 
				userSelect: "none"
  			  }}
  			>
  			  <DialogContentText id="logout-dialog-description">
  			    آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
  			  </DialogContentText>
  			</DialogContent>
  			<DialogActions
    			sx={{
    			  padding: "8px 8px", 
    			  display: "flex",
    			  justifyContent: "center",
    			  gap: "12px",
    			}}
  			>
    		<Button
    		  onClick={handleCloseLogoutDialog}
    		  sx={{
    		    bgcolor: "#e4a073",
    		    color: "white",
    		    fontSize: "16px",
    		    fontWeight: "bold",
    		    borderRadius: "8px",
    		    "&:hover": {
    		      bgcolor: "#d48b6c",
    		    },
    		  }}
    		>
      		خیر
    		</Button>
    		<Button
    		  onClick={handleLogOutClick}
    		  variant="contained"
    		  sx={{
    		    bgcolor: "#f57c00",
    		    color: "white",
    		    fontSize: "16px",
    		    fontWeight: "bold",
    		    borderRadius: "8px",
    		    "&:hover": {
    		      bgcolor: "#e56c00",
    		    },
    		  }}
    		>
    		  بله
    		</Button>
  			</DialogActions>
		</Dialog>
		</Box>
	);
};

export default RestaurantProfile;
