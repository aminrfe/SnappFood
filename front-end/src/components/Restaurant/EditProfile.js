import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axiosInstance from "../../utills/axiosInstance";
import {
	Box,
	TextField,
	Button,
	Typography,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Grid,
} from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate, useParams } from "react-router-dom";
import { format, parse } from "date-fns";

const EditProfile = () => {
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [deliveryCost, setDeliveryCost] = useState("");
	const [description, setDescription] = useState("");
	const [businessType, setBusinessType] = useState("");
	const [openingTime, setOpeningTime] = useState(null);
	const [closingTime, setClosingTime] = useState(null);
	const [logo, setLogo] = useState(null);
	const [mapCenter, setMapCenter] = useState({ lat: 35.6892, lng: 51.389 });
	const [mapMarker, setMapMarker] = useState({ lat: 35.6892, lng: 51.389 });
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
			const response = await axiosInstance.get(`/restaurant/profiles/me`);
			const data = response.data;

			if (data) {
				// console.log(data);
				setName(data.name || "");
				setAddress(data.address || "");
				setDeliveryCost(data.delivery_price || "");
				setDescription(data.description || "");
				setBusinessType(data.business_type || "");
				const opening = parse(data.open_hour, "HH:mm:ss", new Date());
				const closing = parse(data.close_hour, "HH:mm:ss", new Date());
				setOpeningTime(opening);
				setClosingTime(closing);

				if (data.latitude && data.longitude) {
					setMapCenter({
						lat: parseFloat(data.latitude) || 35.6892,
						lng: parseFloat(data.longitude) || 51.389,
					});
					setMapMarker({
						lat: parseFloat(data.latitude) || 35.6892,
						lng: parseFloat(data.longitude) || 51.389,
					});
				}

				if (data.photo) {
					setLogo(data.photo);
				}
			} else {
				console.error("No data received from API");
			}
		} catch (error) {
			console.error("Error fetching profile data:", error);
		}
	};

	const handleFieldChange = (setter) => (e) => {
		setter(e.target.value);
	};

	const handleSave = async () => {
		try {
			const formattedOpeningTime =
				openingTime instanceof Date && !isNaN(openingTime)
					? format(openingTime, "HH:mm:ss")
					: null;

			const formattedClosingTime =
				closingTime instanceof Date && !isNaN(closingTime)
					? format(closingTime, "HH:mm:ss")
					: null;

			const formData = new FormData();
			formData.append("name", name);
			formData.append("address", address);
			formData.append("delivery_price", deliveryCost);
			formData.append("description", description);
			formData.append("business_type", businessType);
			formData.append("open_hour", formattedOpeningTime);
			formData.append("close_hour", formattedClosingTime);
			formData.append("latitude", mapMarker.lat.toFixed(6).toString());
			formData.append("longitude", mapMarker.lng.toFixed(6).toString());

			if (logo instanceof File) {
				formData.append("photo", logo);
			} else {
				console.warn("No valid file selected for photo.");
			}
			// console.log([...formData]);
			await axiosInstance.put(`/restaurant/profiles/me`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			alert("اطلاعات با موفقیت ذخیره شد.");
			navigate(`/restaurant/${id}/profile`);
		} catch (error) {
			if (error.response) {
				console.error("Server Response:", error.response.data);
			} else {
				console.error("Error saving profile data:", error);
			}
			alert("خطا در ذخیره اطلاعات.");
		}
	};

	const handleLogoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setLogo(file);
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

				const fullAddress = `${cityDistrict || city || ""} ${neighbourhood || suburb || ""} ${road || ""} ${state || ""}`;
				setAddress(fullAddress.trim());
			} else {
				console.warn("آدرس پیدا نشد");
			}
		} catch (error) {
			console.error("Error fetching address:", error);
			console.warn("خطا در دریافت آدرس.");
		}
	};

	const handleMapClick = ({ lat, lng }) => {
		setMapCenter({ lat, lng });
		setMapMarker({ lat, lng });
		fetchAddress(lat, lng);
	};

	const navigate = useNavigate();

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
			<Box style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				{/* Business Type */}
				<FormControl fullWidth style={{ backgroundColor: "#fceee3" }}>
					<InputLabel>نوع کسب و کار</InputLabel>
					<Select
						value={businessType}
						onChange={handleFieldChange(setBusinessType)}
						label="نوع کسب و کار"
					>
						<MenuItem value="restaurant">رستوران</MenuItem>
						<MenuItem value="cafe">کافه</MenuItem>
						<MenuItem value="bakery">نانوایی</MenuItem>
						<MenuItem value="sweets">شیرینی</MenuItem>
						<MenuItem value="ice_cream">آبمیوه و بستنی</MenuItem>
					</Select>
				</FormControl>

				{/* Store Name */}
				<TextField
					value={name}
					placeholder="نام فروشگاه"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setName)}
				/>

				{/* Logo Upload */}
				<Box>
					<input
						type="file"
						accept="image/*"
						onChange={handleLogoUpload}
						style={{ display: "none" }}
						id="logo-upload"
					/>
					<label htmlFor="logo-upload">
						<Button
							variant="contained"
							component="span"
							fullWidth
							style={{ backgroundColor: "primary" }}
							sx={{pointerEvents: "auto"}}
						>
							بارگذاری لوگو
						</Button>
					</label>

					{logo && typeof logo === "string" ? (
						<img
							src={`http://localhost:8000${logo}`}
							alt="Logo preview"
							onError={(e) => {
								e.target.onerror = null; 
								e.target.src = "https://via.placeholder.com/100";
							}}
							style={{
								marginTop: "10px",
								width: "100px",
								height: "100px",
								objectFit: "cover",
							}}
						/>
					) : (
						logo && (
							<img
								src={URL.createObjectURL(logo)}
								alt="Logo preview"
								onError={(e) => {
									e.target.onerror = null; 
									e.target.src = "https://via.placeholder.com/100";
								}}
								style={{
									marginTop: "10px",
									width: "100px",
									height: "100px",
									objectFit: "cover",
								}}
							/>
						)
					)}
				</Box>

				<Box>
					<Button
						variant="contained"
						component="span"
						fullWidth
						style={{ backgroundColor: "primary" }}
						onClick={() => navigate(`/restaurant/${id}/menu`)}
						sx={{pointerEvents: "auto"}}
					>
						ویرایش منو
					</Button>
				</Box>

				<Grid container spacing={2}>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								label="ساعت بازگشایی"
								value={openingTime}
								onChange={(time) => setOpeningTime(time)}
								format="HH:mm:ss"
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								label="ساعت تعطیلی"
								value={closingTime}
								onChange={(time) => setClosingTime(time)}
								format="HH:mm:ss"
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>
				</Grid>

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
							key: "AIzaSyD5AZ9092BIIq6gW9SWqdRJ9MBRgTLHLPY",
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

				{/* Address */}
				<TextField
					value={address}
					placeholder="آدرس"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setAddress)}
					disabled
				/>

				{/* Description */}
				<TextField
					value={description}
					placeholder="توضیحات فروشگاه"
					variant="outlined"
					fullWidth
					multiline
					rows={4}
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setDescription)}
				/>

				{/* Delivery Cost */}
				<TextField
					value={Math.floor(deliveryCost)}
					placeholder="هزینه پیک (به تومان)"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
					onChange={handleFieldChange(setDeliveryCost)}
				/>

				{/* Save Button */}
				<Button
					variant="contained"
					color="primary"
					style={{
						backgroundColor: "primary",
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
