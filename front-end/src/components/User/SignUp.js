import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

function SignUp() {
	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate(); // Initialize navigate

	const handleLoginClick = () => {
		navigate("/login");
	};

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!name || !lastName || !phoneNumber || !password || !confirmPassword) {
			setErrorMessage("لطفاً همه فیلدها را پر کنید");
			return;
		}

		if (
			!/^\d+$/.test(phoneNumber) ||
			!phoneNumber.startsWith("09") ||
			phoneNumber.length != 11
		) {
			setErrorMessage("شماره موبایل وارد شده صحیح نیست");
			return;
		}

		let formattedPhoneNumber = phoneNumber.trim();
		if (formattedPhoneNumber.startsWith("0")) {
			formattedPhoneNumber = `98${formattedPhoneNumber.slice(1)}`;
		} else if (!formattedPhoneNumber.startsWith("98")) {
			setErrorMessage("لطفاً شماره موبایل را به‌درستی وارد کنید");
			return;
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(password)) {
			setErrorMessage(
				"رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد",
			);
			return;
		}

		if (password !== confirmPassword) {
			setErrorMessage("رمز عبور و تکرار آن همخوانی ندارند");
			return;
		}

		const userData = {
			first_name: name,
			last_name: lastName,
			phone_number: formattedPhoneNumber,
			password,
		};

		try {
			const response = await axios.post(
				"https://snappfood-aghc.onrender.com/api/auth/signup/customer",
				userData,
			);

			if (response.status === 201) {
				alert("ثبت نام با موفقیت انجام شد. اکنون وارد شوید!");
				handleLoginClick();
			}
		} catch (error) {
			if (error.response?.status === 400) {
				setErrorMessage("این شماره قبلاً ثبت‌نام کرده است.");
			} else {
				setErrorMessage(
					error.response?.data?.message ||
						"مشکلی پیش آمده، لطفاً دوباره تلاش کنید.",
				);
			}
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
					fullWidth
					type="name"
					label="نام"
					variant="standard"
					margin="normal"
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PersonIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="name"
					label="نام خانوادگی"
					variant="standard"
					margin="normal"
					name="lastName"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
			</Box>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="tel"
					label="شماره موبایل"
					variant="standard"
					margin="normal"
					name="phoneNumber"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label={
										showPassword ? "hide the password" : "display the password"
									}
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
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
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label={
										showPassword ? "hide the password" : "display the password"
									}
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</Box>

			{errorMessage && (
				<Typography style={{ color: "red" }}>{errorMessage}</Typography>
			)}

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
				display={"inline"}
				style={{ marginTop: "15px", color: "#616161" }}
			>
				حساب کاربری دارید؟
			</Typography>

			<Typography
				variant="body2"
				display={"inline"}
				style={{ marginTop: "15px", marginRight: "10px", cursor: "pointer" }}
				onClick={handleLoginClick}
				sx={{pointerEvents: "auto"}}
			>
				وارد شوید
			</Typography>
		</div>
	);
}

export default SignUp;
