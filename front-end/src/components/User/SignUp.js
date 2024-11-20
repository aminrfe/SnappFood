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
import Divider from "@mui/material/Divider";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import FoodiImg from "../../assets/imgs/foodiIcon.png";

function SignUp({ onSwitch }) {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		name: "",
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
		if (!formData.name) newErrors.name = "نام الزامی است.";
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

	return (
		<div className="signup-container">
			<img
				src={FoodiImg}
				alt="Login Illustration"
				style={{ width: "50%", marginBottom: "20px" }}
			/>
			<Divider />

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PermIdentityIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					required
					fullWidth
					type="name"
					label="نام"
					variant="standard"
					margin="normal"
					name="name"
					value={formData.name}
					onChange={handleChange}
					error={!!errors.name}
					helperText={errors.name}
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PersonIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="name"
					id="input-with-sx"
					label="نام خانوادگی"
					variant="standard"
					margin="normal"
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					required
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
				</FormControl>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }}>
				<KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<FormControl sx={{ m: 1 }} variant="standard" fullWidth>
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
