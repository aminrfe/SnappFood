import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Toolbar, Button } from "@mui/material";
import FoodiImg from "../../assets/imgs/foodiIcon.png";
import { styled } from "@mui/material/styles";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const checkAuthentication = () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    const isAuthenticated = !!(accessToken && refreshToken); // وضعیت ورود را مشخص می‌کند
    setIsLoggedIn(isAuthenticated);
  };

  useEffect(() => {
    checkAuthentication(); // بررسی اولیه
    // افزودن listener برای تغییرات localStorage
    const handleStorageChange = () => {
      checkAuthentication();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AppBar elevation={1} sx={{ backgroundColor: "#F4DCC9", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)" }}>
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
        {!isLoggedIn ? (
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
