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
		width: "400px",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	position: "absolute",
	left: "8px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: "#D68240",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "#000",
	"& .MuiInputBase-input": {
		padding: theme.spacing(0.8, 1, 0.8, 4),
		fontSize: "14px",
		width: "100%",
	},
}));

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    return !!(accessToken && refreshToken); // true یا false
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
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="جستجو در فودی"
						inputProps={{ "aria-label": "search" }}
					/>
				</Search>
        {!isAuthenticated() ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
            sx={{
              marginTop: "10px !important",
              width: "130px",
              height: "45px",
              borderRadius: "50px !important",
              fontWeight: "400 !important",
            }}
          >
            ورود یا عضویت
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleProfileClick}
            sx={{
              marginTop: "10px !important",
              width: "130px",
              height: "45px",
              borderRadius: "50px !important",
              fontWeight: "400 !important",
            }}
          >
            پروفایل
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
