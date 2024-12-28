import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import axios from "../utills/axiosInstance.js";

function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => event.preventDefault();
	const navigate = useNavigate(); 

	const handleSignUpClick = () => {
		navigate("/user-signup"); 
	};

	const handleStoreSignUpClick = () => {
		navigate("/restuarant-signup");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!phoneNumber) {
			setError("لطفاً شماره تلفن خود را وارد کنید");
			return;
		}

		if (
			!/^\d+$/.test(phoneNumber) ||
			!phoneNumber.startsWith("09") ||
			phoneNumber.length !== 11
		) {
			setError("شماره موبایل وارد شده صحیح نیست");
			return;
		}

		if (!password) {
			setError("لطفاً رمز عبور خود را وارد کنید");
			return;
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(password)) {
			setError(
				"رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد",
			);
			return;
		}

		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/api/auth/token",
				{
					phone_number: `98${phoneNumber.slice(1)}`,
					password: password,
				},
			);

			console.log(response.data);
			localStorage.setItem("access", response.data.access);
			localStorage.setItem("refresh", response.data.refresh);
			localStorage.setItem("res_id", response.data.restaurant_id);
			localStorage.setItem("phone", phoneNumber);

			if (response.data.restaurant_id)
				navigate(`/restaurant/${response.data.restaurant_id}/profile`);
			else navigate("/");
			window.location.reload();
		} catch (error) {
			if (error.response?.status === 401) {
				setError("اطلاعات ورود صحیح نیست.");
			} else {
				setError("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
			}
		}
	};

	return (
		<div className="login-container">
			<img
				src={LoginImg}
				alt="Login Illustration"
				onError={(e) => {
					e.target.onerror = null; 
					e.target.src = "https://via.placeholder.com/100";
				}}
				style={{ width: "80%", marginBottom: "20px" }}
			/>
			<Box
				sx={{ display: "flex", alignItems: "flex-end" }}
				marginBottom={0.9}
				paddingRight={1.5}
				paddingLeft={1}
			>
				<PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
				<TextField
					fullWidth
					type="tel"
					label="شماره موبایل"
					variant="standard"
					margin="normal"
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
			{error && <Typography style={{ color: "red" }}>{error}</Typography>}
			<Button
				variant="contained"
				color="primary"
				fullWidth
				onClick={handleSubmit}
			>
				ورود
			</Button>
			<Typography
				display="inline"
				variant="body2"
				style={{ marginTop: "15px", color: "#616161" }}
			>
				حساب کاربری ندارید؟
			</Typography>
			<Typography
				display="inline"
				variant="body2"
				onClick={handleSignUpClick}
				style={{
					marginTop: "15px",
					marginRight: "10px",
					cursor: "pointer",
				}}
				sx={{pointerEvents: "auto"}}
			>
				ثبت‌نام
			</Typography>
			<Typography
				variant="body2"
				onClick={handleStoreSignUpClick}
				style={{ marginTop: "0px", cursor: "pointer" }}
				sx={{pointerEvents: "auto"}}
			>
				ثبت نام فروشندگان
			</Typography>
		</div>
	);
}

export default Login;
