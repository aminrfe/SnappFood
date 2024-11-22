import React, { useState } from "react";
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
import Select from "@mui/material/Select";
import KeyIcon from "@mui/icons-material/Key";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import StoreIcon from "@mui/icons-material/Store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import FoodiImg from "../../assets/imgs/foodiIcon.png";

function SignUp({ onUserSignUp }) {
	const [businessType, setBusinessType] = useState("");
	const [provinceName, setProvinceName] = useState("");
	const [storeName, setStoreName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setErrors] = useState();
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (
			!businessType ||
			!provinceName ||
			!storeName ||
			!phoneNumber ||
			!password ||
			!confirmPassword
		) {
			setErrors("لطفاً همه فیلدها را پر کنید");
			return;
		}

		if (
			!/^\d+$/.test(phoneNumber) ||
			!phoneNumber.startsWith("09") ||
			phoneNumber.length != 11
		) {
			setErrors("شماره موبایل وارد شده صحیح نیست");
			return;
		}

		let formattedPhoneNumber = phoneNumber.trim();
		if (formattedPhoneNumber.startsWith("0")) {
			formattedPhoneNumber = `98${formattedPhoneNumber.slice(1)}`;
		} else if (!formattedPhoneNumber.startsWith("98")) {
			setErrors("لطفاً شماره موبایل را به‌درستی وارد کنید");
			return;
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(password)) {
			setErrors(
				"رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد",
			);
			return;
		}

		if (password !== confirmPassword) {
			setErrors("رمز عبور و تکرار آن همخوانی ندارند");
			return;
		}

		const RestaurantData = {
			name: storeName,
			city_name: provinceName,
			phone_number: phoneNumber,
			password: password,
			business_type: businessType,
		};

		try {
			const response = await axios.post(
				"http://localhost:8000/api/auth/signup/restaurant",
				RestaurantData,
			);

			if (response.status === 201) {
				alert("ثبت نام با موفقیت انجام شد. اکنون وارد شوید!");
				onUserSignUp();
			}
		} catch (error) {
			if (error.response?.status === 400) {
				setErrors("این شماره قبلاً ثبت‌نام کرده است.");
			} else {
				setErrors(
					error.response?.data?.message ||
						"مشکلی پیش آمده، لطفاً دوباره تلاش کنید.",
				);
			}
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
				style={{ width: "50%", marginBottom: "20px", marginTop: "60px" }}
			/>

			<Divider />

			<FormControl fullWidth variant="standard" sx={{ marginTop: "30px" }}>
				<InputLabel>نوع کسب و کار</InputLabel>
				<Select
					value={businessType}
					name="businessType"
					onChange={(e) => setBusinessType(e.target.value)}
				>
					<MenuItem value={10}>کافه</MenuItem>
					<MenuItem value={20}>رستوران</MenuItem>
					<MenuItem value={30}>کیترینگ</MenuItem>
				</Select>
			</FormControl>

			<Box sx={{ display: "flex", alignItems: "flex-end" }} marginBottom={0.9}>
				<TextField
					fullWidth
					type="text"
					label="نام استان"
					variant="standard"
					margin="normal"
					name="provinceName"
					value={provinceName}
					onChange={(e) => setProvinceName(e.target.value)}
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
					value={storeName}
					onChange={(e) => setStoreName(e.target.value)}
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
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
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
					value={password}
					onChange={(e) => setPassword(e.target.value)}
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
				<FormControl
					sx={{ m: 1 }}
					fullWidth
					variant="standard"
					id="confirmPassword"
					name="confirmPassword"
					type={showPassword ? "text" : "password"}
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
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
				onClick={onUserSignUp}
			>
				وارد شوید
			</Typography>
		</div>
	);
}

export default SignUp;
