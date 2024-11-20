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
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import LoginImg from "../assets/imgs/login.png";

function Login({ onSwitch }) {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		phoneNumber: "",
		password: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.phoneNumber)
			newErrors.phoneNumber = "لطفا شماره موبایل خود را وارد کنید.";
		if (!formData.password) newErrors.password = "رمزعبور خود را وارد کنید.";

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

	return (
		<div className="login-container">
			<img
				src={LoginImg}
				alt="Login Illustration"
				style={{ width: "100%", marginBottom: "20px" }}
			/>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="tel"
					label="شماره موبایل"
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
				<FormControl sx={{ m: 1 }} variant="standard" fullWidth>
					<InputLabel>رمزعبور</InputLabel>
					<Input
						fullWidth
						type={showPassword ? "text" : "password"}
						name="password"
						value={formData.password}
						onChange={handleChange}
						error={!!errors.password}
						helperText={errors.password}
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
				</FormControl>
			</Box>

			<Button
				fullWidth
				color="primary"
				variant="contained"
				onClick={handleSubmit}
			>
				ورود
			</Button>

			<Typography variant="body2" onClick={onSwitch}>
				حساب کاربری ندارید؟ ثبت‌نام کنید.
			</Typography>
		</div>
	);
}

export default Login;
