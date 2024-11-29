import React from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Toolbar, Button } from "@mui/material";
import FoodiImg from "../../assets/imgs/foodiIcon.png";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: "16px !important",
	backgroundColor: "#FDF5ED",
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	height: "40px",
	display: "flex",
	alignItems: "center",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "400px", // Fixed width for medium screens and up
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	position: "absolute",
	left: "8px", // Move the icon to the left
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: "#D68240", // Add orange color for the icon
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "#000", // Black text for contrast
	"& .MuiInputBase-input": {
		padding: theme.spacing(0.8, 1, 0.8, 4), // Adjust padding for icon spacing
		fontSize: "14px", // Match font size in the design
		width: "100%",
	},
}));

const Header = () => {
	const navigate = useNavigate();

	const handleLoginClick = () => {
		navigate("/login");
	};

	return (
		<AppBar elevation={0.5} sx={{ backgroundColor: "#F4DCC9" }}>
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<img
					src={FoodiImg}
					alt="Login Illustration"
					style={{ width: "100px" }}
				/>
				<Search>
					<SearchIconWrapper>
						<SearchIcon  />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="جستجو در فودی"
						inputProps={{ "aria-label": "search" }}
					/>
				</Search>
				<Button
					variant="contained"
					color="primary"
					onClick={handleLoginClick}
					sx={{
                        marginTop:"10px !important",
						width: "130px",
						height: "45px",
						borderRadius: "50px !important",
						fontWeight: "400 !important",
					}}
				>
					ورود یا عضویت
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
