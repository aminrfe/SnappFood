import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	IconButton,
	InputAdornment,
	FormControl,
	InputLabel,
	Input,
} from "@mui/material";
import Select from "@mui/material/Select";
import KeyIcon from "@mui/icons-material/Key";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import StoreIcon from "@mui/icons-material/Store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import FoodiImg from "../../assets/imgs/foodiIcon.png";

function SignUp({ onSwitch }) {
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		businessType: "",
		provinceName: "",
		storeName: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.businessType)
			newErrors.businessType = "نوع کسب و کار الزامی است.";
		if (!formData.provinceName)
			newErrors.provinceName = "نام استان الزامی است.";
		if (!formData.storeName) newErrors.storeName = "نام فروشگاه الزامی است.";
		if (!formData.phoneNumber) newErrors.phoneNumber = "شماره تلفن الزامی است.";
		if (!formData.password) newErrors.password = "رمزعبور الزامی است.";
		if (formData.password !== formData.confirmPassword)
			newErrors.confirmPassword = "رمزعبور و تکرار آن یکسان نیست.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			console.log("Form submitted successfully!", formData);
		} else {
			console.log("Validation failed", errors);
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<div className="signup-container">
			<img
				src={FoodiImg}
				alt="Login Illustration"
				style={{ width: "50%", marginBottom: "20px" }}
			/>

			<Divider />

			<FormControl
				fullWidth
				variant="standard"
				sx={{ marginTop: "30px" }}
				error={!!errors.businessType}
			>
				<InputLabel>نوع کسب و کار</InputLabel>
				<Select
					value={formData.businessType}
					name="businessType"
					onChange={handleChange}
				>
					<MenuItem value={10}>کافه</MenuItem>
					<MenuItem value={20}>رستوران</MenuItem>
					<MenuItem value={30}>کیترینگ</MenuItem>
				</Select>
				<Typography color="error" sx={{textAlign: "start"}}>{errors.businessType}</Typography>
			</FormControl>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<TextField
					fullWidth
					type="text"
					label="نام استان"
					variant="standard"
					margin="normal"
					name="provinceName"
					value={formData.provinceName}
					onChange={handleChange}
					error={!!errors.provinceName}
					helperText={errors.provinceName}
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<StoreIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="text"
					label="نام فروشگاه"
					variant="standard"
					margin="normal"
					name="storeName"
					value={formData.storeName}
					onChange={handleChange}
					error={!!errors.storeName}
					helperText={errors.storeName}
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="tel"
					label="شماره تلفن"
					variant="standard"
					margin="normal"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					error={!!errors.phoneNumber}
					helperText={errors.phoneNumber}
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }}>
				<KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<FormControl
					sx={{ m: 1 }}
					fullWidth
					variant="standard"
					id="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					error={!!errors.password}
					helperText={errors.password}
				>
					<InputLabel htmlFor="standard-adornment-password">رمزعبور</InputLabel>
					<Input
						fullWidth
						id="standard-adornment-password"
						type={showPassword ? "text" : "password"}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label={
										showPassword ? "hide the password" : "display the password"
									}
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									// onMouseUp={handleMouseUpPassword}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					<Typography color="error" variant="body2">
						{errors.confirmPassword}
					</Typography>
				</FormControl>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }}>
				<KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<FormControl
					sx={{ m: 1 }}
					fullWidth
					variant="standard"
					id="confirmPassword"
					name="confirmPassword"
					type={showPassword ? "text" : "password"}
					value={formData.confirmPassword}
					onChange={handleChange}
					error={!!errors.password}
					helperText={errors.password}
				>
					<InputLabel htmlFor="standard-adornment-password">
						تکرار رمزعبور
					</InputLabel>
					<Input
						fullWidth
						id="standard-adornment-password"
						type={showPassword ? "text" : "password"}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label={
										showPassword ? "hide the password" : "display the password"
									}
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									// onMouseUp={handleMouseUpPassword}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					<Typography color="error" variant="body2">
						{errors.confirmPassword}
					</Typography>
				</FormControl>
			</Box>

			<Button
				variant="contained"
				color="primary"
				fullWidth
				style={{ marginTop: "20px" }}
				onClick={handleSubmit}
			>
				ثبت‌نام
			</Button>

			<Typography
				variant="body2"
				style={{ marginTop: "15px", cursor: "pointer" }}
				onClick={onSwitch}
			>
				حساب کاربری دارید؟ وارد شوید.
			</Typography>
		</div>
	);
}

export default SignUp;
