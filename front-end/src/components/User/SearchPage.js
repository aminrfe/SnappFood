import React, { useState, useEffect } from "react";
import { Box, TextField ,InputAdornment ,Typography, Card, CardMedia, CardContent, Grid, IconButton } from "@mui/material";
import { FavoriteBorder, Favorite, Star } from "@mui/icons-material";
import publicAxiosInstance from "../../utills/publicAxiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import FoodiImg from "../../assets/imgs/foodiIcon.png"; 
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../utills/axiosInstance";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  return (
    <AppBar
      elevation={1}
      sx={{
        backgroundColor: "#F4DCC9",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
        <img
        
          onClick={() => navigate("/")}
          src={FoodiImg}
          alt="Foodi Logo"
          style={{ width: "100px", cursor:"pointer" }}
        />
        <Typography variant="h5" sx={{ textAlign: "center", color: "#D68240", pointerEvents: "none", userSelect: "none" }}>
        لیست رستوران‌ها
        </Typography>
        <div>
          {!isLoggedIn ? (
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginTop: "10px !important",
                width: "130px",
                height: "45px",
                borderRadius: "50px !important",
                fontWeight: "400 !important",
              }}
              onClick={handleLoginClick}
            >
              ورود یا عضویت
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginTop: "10px !important",
                width: "130px",
                height: "45px",
                borderRadius: "50px !important",
                fontWeight: "400 !important",
              }}
              onClick={handleProfileClick}
            >
              پروفایل
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

const RestaurantListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("name") || ""); // دریافت مقدار جستجو از URL
  const [businessType, setBusinessType] = useState(searchParams.get("business_type") || "all");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState({});

  const categories = {
    all: "همه",
    restaurant: "رستوران",
    cafe: "کافه",
    bakery: "نانوایی",
    sweets: "شیرینی",
    ice_cream: "بستنی",
  };

  const fetchRestaurants = async (filters = {}) => {
    try {
      const response = await publicAxiosInstance.get("/restaurant/profiles", { params: filters });
      setRestaurants(response.data);
    } catch (err) {
      setError("خطا در دریافت اطلاعات رستوران‌ها");
    }
  };

  useEffect(() => {
    const filters = {};
    if (searchTerm.trim()) {
      filters.name = searchTerm.trim();
    }
    if (businessType !== "all") {
      filters.business_type = businessType;
    }

    fetchRestaurants(filters);

    // به‌روزرسانی URL با پارامترهای جستجو
    const params = new URLSearchParams(filters);
    navigate(`/search?${params.toString()}`);
  }, [searchTerm, businessType]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (localStorage.getItem("access")) {
          const response = await axiosInstance.get("/customer/favorites");
          const favoritesMap = {};
          response.data.forEach((fav) => {
            favoritesMap[fav.restaurant] = true;
          });
          setFavorites(favoritesMap);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (restaurantId) => {
    if (!isAuthenticated) {
      alert("لطفا ابتدا وارد حساب کاربری خود شوید!");
      return;
    }

    try {
      if (favorites[restaurantId]) {
        const response = await axiosInstance.delete(`/customer/favorites`, {
          params: { restaurant_id: restaurantId },
        });

        if (response.status === 204) {
          setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [restaurantId]: false,
          }));
        }
      } else {
        const response = await axiosInstance.post("/customer/favorites", {
          restaurant_id: restaurantId,
        });

        if (response.status === 201) {
          setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [restaurantId]: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCategoryClick = (type) => {
    setBusinessType(type);
  };

  return (
    <Box sx={{ padding: 3, height: "100vh", width: "100%", backgroundColor: "#fffbf7" }}>
        <Header />

      <Box sx={{ display: "flex", justifyContent: "center",  marginTop:"60px" }}>
      <TextField
        variant="outlined"
        placeholder="جستجوی نام فروشگاه..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          marginBottom: 3,
          width: "80%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#9c9c9c",
            },
            "&:hover fieldset": {
              borderColor: "#a8a8a8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#888888",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#D68240" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2}}>
        {Object.entries(categories).map(([key, label]) => (
          <Typography
            key={key}
            onClick={() => handleCategoryClick(key)}
            sx={{
              pointerEvents: "auto",
              cursor: "pointer",
              padding: 1,
              margin: 1,
              border: key === businessType ? "2px solid #D68240" : "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: key === businessType ? "#fceddc" : "transparent",
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* نمایش رستوران‌ها */}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3} justifyContent="center">
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={2} key={restaurant.id}>
            <Card
              sx={{
                cursor: "pointer",
                padding: 1,
                borderRadius: "20px",
                boxShadow: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 5,
                  border: "2px solid #D68240",
                },
              }}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <CardMedia
                component="img"
                height="160"
                image={`http://127.0.0.1:8000${restaurant.photo}`}
                alt={restaurant.name}
                sx={{ borderRadius: "12px", objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 1 }}>
                  {restaurant.name} ({restaurant.city_name})
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  <Star sx={{ color: "#FFD700", marginLeft: 0.5, fontSize: "0.9rem" }} />
                  امتیاز: {restaurant.score}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", marginTop: 1, fontSize: "0.9rem" }}>
                  هزینه ارسال: {Math.floor(parseFloat(restaurant.delivery_price))} تومان
                </Typography>
              </CardContent>

              <IconButton
                sx={{
                  position: "absolute",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(restaurant.id);
                }}
              >
                {favorites[restaurant.id] ? (
                  <Favorite sx={{ color: "#FF1493" }} />
                ) : (
                  <FavoriteBorder sx={{ color: "#FF1493" }} />
                )}
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {restaurants.length === 0 && !error && (
        <Typography sx={{ textAlign: "center", marginTop: 3 }}>هیچ موردی یافت نشد.</Typography>
      )}
    </Box>
  );
};

export default RestaurantListPage;
