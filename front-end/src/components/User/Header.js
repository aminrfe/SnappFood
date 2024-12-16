import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Toolbar, Button } from "@mui/material";
import FoodiImg from "../../assets/imgs/foodiIcon.png";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import axiosInstance from "../../utills/publicAxiosInstance"; // فرض بر این است که axios برای ارسال درخواست‌ها تنظیم شده باشد

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
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurantList, setRestaurantList] = useState([]); // لیست رستوران‌ها
  const [debounceTimeout, setDebounceTimeout] = useState(null); // مدیریت debounce
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    setIsLoggedIn(!!(accessToken && refreshToken));
  };

  useEffect(() => {
    checkAuthentication();
    const handleStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate(`/customer/profile`);
  };

  const fetchRestaurantList = async (query) => {
    if (query.trim() === "") {
      setRestaurantList([]);
      return;
    }

    try {
      const params = { name: query };

      const response = await axiosInstance.get("/restaurant/list/", {
        params,
      });

      setRestaurantList(response.data); // لیست رستوران‌ها را در state ذخیره می‌کنیم
    } catch (error) {
      console.error("Error fetching restaurant list:", error);
      setRestaurantList([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // تایمر قبلی را پاک می‌کنیم
    }

    const timeout = setTimeout(() => {
      fetchRestaurantList(value); // ارسال درخواست به API بعد از تایپ
    }, 500); // پس از 500 میلی‌ثانیه درخواست ارسال می‌شود

    setDebounceTimeout(timeout); // ذخیره تایمر برای پاک کردن در صورت تغییر
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?name=${searchTerm}`);
    }
  };

  return (
    <AppBar
      elevation={1}
      sx={{
        backgroundColor: "#F4DCC9",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      }}
    >
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
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress} // اضافه کردن handler برای فشردن Enter
          />
          {/* نمایش لیست رستوران‌ها */}
          {restaurantList.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                left: "0",
                right: "0",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                zIndex: "100",
              }}
            >
              <ul style={{ listStyle: "none", margin: 0, padding: "10px" }}>
                {restaurantList.map((restaurant) => (
                  <li
                    key={restaurant.id}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)} // کلیک بر روی هر رستوران برای رفتن به صفحه آن
                  >
                    {/* نمایش تصویر رستوران */}
                    {restaurant.photo && (
                      <img
                        src={`http://127.0.0.1:8000${restaurant.photo}`} // مسیر عکس رستوران
                        alt={restaurant.name}
                        style={{
                          width: "80px", // بزرگتر کردن اندازه عکس
                          height: "80px",
                          borderRadius: "4px", // مربع کردن عکس
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <div>
                      {/* نمایش نام رستوران و آدرس */}
                      <div style={{ fontWeight: "bold", marginRight:"10px", color: "#555"}}>{restaurant.name}</div> {/* اضافه کردن نام رستوران */}
                      <div style={{ fontSize: "12px", color: "#555", marginRight:"10px" }}>
                        {restaurant.city_name}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
