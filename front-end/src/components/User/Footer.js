import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import FoodiImg from "../../assets/imgs/foodiIcon.png";

const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				backgroundColor: "#F4DCC9", 
				padding: "20px",
				marginTop: "auto", 
				width: "100vw",
			}}
		>
			<Grid container spacing={2} paddingTop={2} paddingBottom={3}>
				<Grid
					sx={{
						alignItems: "center",
						justifyContent: "center",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<img src={FoodiImg} alt="Foodi Icon" style={{ width: "155px" }} />
					<Box>
						<IconButton
							href="#"
							aria-label="Facebook"
							sx={{ color: "#D68240" }}
						>
							<Facebook />
						</IconButton>
						<IconButton
							href="#"
							aria-label="Twitter"
							sx={{
								color: "#D68240",
								paddingLeft: "30px",
								paddingRight: "30px",
							}}
						>
							<Twitter />
						</IconButton>
						<IconButton
							href="#"
							aria-label="Instagram"
							sx={{ color: "#D68240" }}
						>
							<Instagram />
						</IconButton>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6} marginLeft={1.8} marginRight={60}>
					<Typography
						variant="h6"
						sx={{ pointerEvents: "none", color: "#D68240", fontWeight: "bold" }}
					>
						فودی
					</Typography>
					<Typography
						variant="h7"
						sx={{ pointerEvents: "none", paddingTop: "11px" }}
					>
						تجربه بهترین سفارش آنلاین غذا
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6} paddingLeft={16} paddingRight={7}>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						ارتباط با ما
					</Link>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						درباره ما
					</Link>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						فرصت های شغلی
					</Link>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						قوانین سایت
					</Link>
				</Grid>
				<Grid paddingLeft={7}>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						ثبت نام فروشندگان
					</Link>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						پرسش های متدوال
					</Link>
					<Link
						href="#"
						sx={{
							display: "block",
							textDecoration: "none",
							color: "inherit",
							"&:hover": {
								textDecoration: "none",
								color: "inherit",
							},
						}}
					>
						ثبت شکایت
					</Link>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Footer;
