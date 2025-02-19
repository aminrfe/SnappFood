import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardMedia,
	CardContent,
	Typography,
	IconButton,
	Button,
	useMediaQuery,
} from "@mui/material";
import Footer from "./Footer";
import Grid from "@mui/material/Grid2";
import BigPizza from "../../assets/imgs/big-pizza.png";
import { FavoriteBorder, Favorite, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import publicAxiosInstance from "../../utills/publicAxiosInstance";

const HeroSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				paddingTop: "100px",
				paddingBottom: "40px",
				backgroundColor: "#fff",
			}}
		>
			<Grid
				container
				spacing={2}
				alignItems="center"
				justifyContent="center"
				direction={{ xs: "column", sm: "row" }}
				sx={{ width: "100%" }}
			>
				<Grid item xs={12} sm={6} md={6} lg={6}>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							color: "#000",
							fontWeight: "bold",
							textAlign: { xs: "center", sm: "left" },
							pointerEvents: "none",
							fontSize: { xs: "1.5rem", md: "2rem" },
						}}
					>
						توی کوتاه‌ترین زمان ممکن
					</Typography>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							color: "#D68240",
							fontWeight: "bold",
							marginTop: "15px",
							textAlign: { xs: "center", sm: "left" },
							pointerEvents: "none",
							fontSize: { xs: "1.5rem", md: "2.1rem" },
						}}
					>
						غذای مورد علاقت رو سفارش بده.
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6} md={6} lg={6}>
					<img
						src={BigPizza}
						alt="Hero Pizza"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "https://via.placeholder.com/100";
						}}
						style={{
							width: "100%",
							maxWidth: "600px",
							height: "auto",
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

const CategoryCards = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (businessType) => {
    navigate(`/search?business_type=${businessType}`);
  };

  const categories = [
    { title: "رستوران", icon: "🍔", type: "restaurant" },
    { title: "کافه", icon: "☕️", type: "cafe" },
    { title: "شیرینی", icon: "🍩", type: "sweets" },
    { title: "آبمیوه و بستنی", icon: "🍹", type: "ice_cream" },
    { title: "نانوایی", icon: "🍞", type: "bakery" },
  ];

  return (
    <Box sx={{ width: "100%", padding: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        sx={{
          margin: 2,
          color: "#D68240",
          fontWeight: "bold",
          pointerEvents: "none",
        }}
      >
        دسته بندی‌ها
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: "#F4DCC9",
          padding: { xs: 2, sm: 3 },
          justifyContent: "center",
        }}
      >
        {categories.map((category, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2.4}
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              onClick={() => handleCategoryClick(category.type)}
              sx={{
                cursor: "pointer",
                textAlign: "center",
                padding: 1.5,
                margin: 1,
                width: { xs: "140px", sm: "200px", md: "155px", lg: "180px" },
                maxWidth: "200px",
                borderRadius: "20px",
                boxShadow: 0,
                "&:hover": {
                  transform: "scale(1.05)",
                  border: "2px solid #D68240",
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  pointerEvents: "none",
                  paddingTop: "11px",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                {category.icon}
              </Typography>
              <CardContent sx={{ paddingBottom: "10px !important" }}>
                <Typography sx={{ pointerEvents: "none", fontSize: "0.9rem" }}>
                  {category.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ProductSlider = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const checkAuthentication = () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    setIsLoggedIn(!!(accessToken && refreshToken));
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await publicAxiosInstance.get("/restaurant/profiles");
        console.log(response.data);
        const sortedRestaurants = response.data.restaurants.sort(
          (a, b) => b.score - a.score
        );
        setRestaurants(sortedRestaurants);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات رستوران‌ها:", error);
      }
    };

    const fetchFavorites = async () => {
      if (isLoggedIn) {
        try {
          const response = await axiosInstance.get("/customer/favorites");
          const favoriteMap = {};
          response.data.forEach((fav) => {
            favoriteMap[fav.restaurant] = true;
          });
          setFavorites(favoriteMap);
        } catch (error) {
          console.error("خطا در دریافت علاقه‌مندی‌ها:", error);
        }
      }
    };

    fetchRestaurants();
    fetchFavorites();
  }, [isLoggedIn]);

  const toggleFavorite = async (restaurantId) => {
    if (!isLoggedIn) {
      alert("برای افزودن به علاقه‌مندی‌ها لطفاً ابتدا وارد حساب خود شوید.");
      return;
    }

    const isFavorite = favorites[restaurantId];
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/customer/favorites`, {
          params: { restaurant_id: restaurantId },
        });
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [restaurantId]: false,
        }));
      } else {
        await axiosInstance.post("/customer/favorites", {
          restaurant_id: restaurantId,
        });
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [restaurantId]: true,
        }));
      }
    } catch (error) {
      console.error("خطا در تغییر علاقه‌مندی‌ها:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ margin: 2, marginTop: 4, marginBottom: 0 }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#D68240",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          محبوب ترین ها
        </Typography>
        <Button
          variant="text"
          sx={{
            color: "#D68240",
            fontWeight: "bold",
            fontSize: "14px",
            textDecoration: "underline",
          }}
          style={{ backgroundColor: "transparent", color: "#D68240" }}
          onClick={() => navigate(`/search?name=`)}
        >
          مشاهده همه
        </Button>
      </Box>
      <Grid
        container
        spacing={1}
        backgroundColor={"#F4DCC9"}
        padding={3}
        width={"100%"}
      >
        {restaurants.slice(0, 6).map((restaurant) => {
          const isFavorite = favorites[restaurant.id];

          return (
            <Card
              key={restaurant.id}
              onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
              sx={{
                cursor: "pointer",
                padding: 2,
                margin: 1,
                minWidth: 230,
                borderRadius: "20px",
                boxShadow: 0,
                "&:hover": {
                  transform: "scale(1.05)",
                  border: "2px solid #D68240",
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={
                  restaurant.photo
                    ? `http://127.0.0.1:8000${restaurant.photo}`
                    : "https://via.placeholder.com/120"
                }
                alt={restaurant.name}
              />
              <CardContent>
                <Typography variant="h6" sx={{ pointerEvents: "none" }}>
                  {restaurant.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pointerEvents: "none" }}
                >
                  <Star sx={{ paddingTop: "12px" }} />
                  امتیاز: {restaurant.score}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pointerEvents: "none" }}
                >
                  هزینه ارسال:{" "}
                  {Math.floor(parseFloat(restaurant.delivery_price))} تومان
                </Typography>
              </CardContent>
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(restaurant.id);
                }}
              >
                {isFavorite ? (
                  <Favorite sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </Card>
          );
        })}
      </Grid>
    </Box>
  );
};

const UpFooter = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );

  return (
    <Grid
      container
      alignItems="center"
      direction={isSmallScreen ? "column" : "row"}
      sx={{ padding: isSmallScreen ? 2 : 0 }}
    >
      <Box
        marginLeft={isSmallScreen ? 0 : 12}
        marginTop={isSmallScreen ? 4 : 8}
        marginBottom={isSmallScreen ? 0 : 8}
        marginRight={isSmallScreen ? 0 : 15}
        textAlign={"left"}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          sx={{
            marginBottom: 2,
            color: "#D68240",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          صاحب یک کسب و کار هستید؟
        </Typography>
        <Typography
          variant={isSmallScreen ? "body1" : "h5"}
          sx={{
            marginBottom: 2,
            color: "black",
            pointerEvents: "none",
          }}
        >
          با فودی کسب و کارتان را آنلاین کنید و فروشتان را افزایش دهید.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/restuarant/signup")}
        sx={{
          marginLeft: isSmallScreen ? 0 : 10,
          marginBottom: isMediumScreen ? "50px !important" : 0,
          width: isSmallScreen ? "100%" : "155px",
          height: "50px",
          borderRadius: "50px !important",
          fontWeight: "400 !important",
        }}
      >
        ثبت نام فروشندگان
      </Button>
    </Grid>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const resID = localStorage.getItem("res_id"); // نقش کاربر (رستوران، مشتری و غیره) در localStorage ذخیره شده
    if (
      resID !== "undefined" &&
      resID !== undefined &&
      resID !== null &&
      resID !== ""
    ) {
      if (!resID) navigate("/");
      else navigate(`restaurant/${resID}/profile`);
    }
  }, [navigate]);

  return (
    <div>
      <HeroSection />
      <CategoryCards />
      <ProductSlider />
      <UpFooter />
      <Footer />
    </div>
  );
};

export default HomePage;
