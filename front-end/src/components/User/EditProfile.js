import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const EditProfile = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const [name, setName] = useState(user?.user?.first_name);
	const [familyName, setFamilyName] = useState(user?.user?.last_name);
	const [address, setAddress] = useState(user?.address?.split("@")[0] || "آدرس");
	const [Department, setDepartment] = useState(
		user?.address?.split("@")[1] || "",
	);
	const [mapCenter, setMapCenter] = useState({
		lat: parseFloat(user?.latitude) || 35.6892,
		lng: parseFloat(user?.longitude) || 51.389,
	});

	const [mapMarker, setMapMarker] = useState({
		lat: parseFloat(user?.latitude) || 35.6892,
		lng: parseFloat(user?.longitude) || 51.389,
	});

	const handleFieldChange = (setter) => (e) => {
		setter(e.target.value);
	};

	const handleSave = async () => {
		try {
			const userObject = {
				user: {
					first_name: name,
					last_name: familyName,
				},
				address: address + "@" + Department,
				longitude: mapMarker.lng.toFixed(6).toString(),
				latitude: mapMarker.lat.toFixed(6).toString(),
			};

			await axiosInstance.patch("/customer/profile", userObject, {
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
				},
			});

			const response = await axiosInstance.get("/customer/profile");
			localStorage.setItem("user", JSON.stringify(response.data));

			alert("اطلاعات با موفقیت ذخیره شد.");
			navigate("/customer/profile");
		} catch (error) {
			if (error.response) {
				console.error("Server Response:", error.response.data);
			} else {
				console.error("Error saving profile data:", error);
			}
			alert("خطا در ذخیره اطلاعات.");
		}
	};

	const handleGetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setMapCenter({ lat: latitude, lng: longitude });
					setMapMarker({ lat: latitude, lng: longitude });
					fetchAddress(latitude, longitude);
				},
				(error) => {
					console.error("Error getting location:", error);
					alert("دسترسی به موقعیت مکانی ممکن نیست.");
				},
			);
		} else {
			alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
		}
	};

	const fetchAddress = async (lat, lng) => {
		try {
			// Use OpenStreetMap Nominatim API for Reverse Geocoding with language set to Persian (fa)
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&language=fa`,
			);
			const data = await response.json();

			if (data && data.address) {
				const road = data.address.road || "";
				const neighbourhood = data.address.neighbourhood || "";
				const suburb = data.address.suburb || "";
				const city = data.address.city || "";
				const cityDistrict = data.address.city_district || "";
				const state = data.address.state || "";
				const fullAddress = `${neighbourhood || suburb || ""} ${road || ""} ${
					cityDistrict || city || ""
				} ${state || ""}`;
				setAddress(fullAddress.trim());
			}
		} catch (error) {
			console.error("Error fetching address:", error);
		}
	};

	const handleMapClick = ({ lat, lng }) => {
		setMapCenter({ lat, lng }); // Set map center to clicked location
		setMapMarker({ lat, lng }); // Set marker to clicked location
		fetchAddress(lat, lng); // Fetch address when map is clicked
	};

	return (
		<Box
			style={{
				width: "70%",
				height: "100vh",
				margin: "0 auto",
				paddingTop: "80px",
				paddingRight: "15px",
				paddingLeft: "15px",
				backgroundColor: "#fff",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
				boxSizing: "border-box",
				position: "relative",
			}}
		>
			{/* Header */}
			<Box
				style={{
					backgroundColor: "#eead7a",
					padding: "15px",
					position: "fixed",
					top: 0,
					left: "15%",
					width: "70%",
					textAlign: "center",
					zIndex: 1000,
					boxSizing: "border-box",
				}}
			>
				<Typography
					variant="h6"
					style={{
						color: "white",
						fontWeight: "bold",
					}}
				>
					ویرایش اطلاعات
				</Typography>
			</Box>

			{/* Profile Form */}
			<Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
				{/* Name Field */}
				<TextField
					value={name}
					placeholder="نام"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setName)}
				/>

				{/* Family Name Field */}
				<TextField
					value={familyName}
					placeholder="نام خانوادگی"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setFamilyName)}
				/>

				{/* Google Map */}
				<Box
					style={{
						height: "400px",
						borderRadius: "8px",
						overflow: "hidden",
						marginBottom: "10px",
						position: "relative",
					}}
				>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: "AIzaSyD5AZ9092BIIq6gW9SWqdRJ9MBRgTLHLPY", // Replace with your API key
						}}
						center={mapCenter}
						zoom={14}
						onClick={handleMapClick}
					>
						<div
							lat={mapMarker.lat}
							lng={mapMarker.lng}
							style={{
								color: "red",
								fontSize: "24px",
								transform: "translate(-50%, -50%)",
							}}
						>
							<FaMapMarkerAlt />
						</div>
					</GoogleMapReact>
				</Box>

				{/* Current Location Button */}
				<Button
					style={{
						backgroundColor: "#fff",
						color: "white",
						fontWeight: "bold",
						// padding: "10px",
						marginTop: "5px",
						borderRadius: "8px",
						textAlign: "center",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					onClick={handleGetCurrentLocation}
				>
					<FaMapMarkerAlt style={{ color: "black", marginRight: "5px" }} />
				</Button>

				{/* Address Field */}
				<TextField
					value={address}
					placeholder="آدرس"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setAddress)}
					disabled
				/>

				<TextField
					value={Department || " "}
					placeholder="پلاک و واحد"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setDepartment)}
				/>

				{/* Save Button */}
				<Button
					variant="contained"
					color="primary"
					style={{
						backgroundColor: "#f0871f",
						color: "white",
						fontWeight: "bold",
						padding: "10px",
						borderRadius: "8px",
						textAlign: "center",
					}}
					onClick={handleSave}
				>
					تایید
				</Button>
			</Box>
		</Box>
	);
};

export default EditProfile;
