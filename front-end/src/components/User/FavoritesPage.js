import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Grid,
  Toolbar,
  AppBar
} from "@mui/material";

import Delete from "@mui/icons-material/Delete";
import Favorite from "@mui/icons-material/Favorite";
import axiosInstance from "../../utills/axiosInstance";
import { useNavigate } from "react-router-dom";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [fullFavoritesData, setFullFavoritesData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/customer/favorites")
      .then((response) => {
        // console.log(response.data);
        setFavorites(response.data);
      })
      .catch((err) => {
        setError("خطا در بارگذاری داده‌ها");
      });
  }, []);

  useEffect(() => {
    const fetchAllRestaurantsDetails = async () => {
      try {
        const restaurantPromises = favorites.map((restaurant) =>
          axiosInstance.get(`/restaurant/profiles/${restaurant.restaurant}`)
        );

        const restaurantResponses = await Promise.all(restaurantPromises);
        const fullData = restaurantResponses.map((response, index) => {
          return {
            ...favorites[index],
            ...response.data,
          };
        });
        setFullFavoritesData(fullData);
      } catch (err) {
        setError("خطا در دریافت جزئیات رستوران‌ها");
      }
    };

    if (favorites.length > 0) {
      fetchAllRestaurantsDetails();
    }
  }, [favorites]);

  const deleteFromFavorites = async (restaurantId) => {
    try {
      const response = await axiosInstance.delete(`/customer/favorites`, {
        params: { restaurant_id: restaurantId },
      });

      if (response.status === 204) {
        alert("فروشگاه از لیست علاقه مندی شما حذف شد");

        setFavorites((prevFavorites) =>
          prevFavorites.filter(
            (favorite) => favorite.restaurant !== restaurantId
          )
        );
        setFullFavoritesData((prevData) =>
          prevData.filter((restaurant) => restaurant.id !== restaurantId)
        );
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <Box sx={{ padding: 0 }}>
            <AppBar
        position="static"
        sx={{
          backgroundColor: "#F4DCC9",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img
              src={FoodiLogo}
              alt="Foodi Logo"
              style={{ width: "100px", cursor: "pointer" }}
            />
          </a>
          <Typography
            variant="h6"
            sx={{
              color: "#D68240",
              fontWeight: "bold",
              flex: 1,
              textAlign: "center",
              userSelect: "none",
              pointerEvents: "none",
              paddingRight: "50px",
            }}
          >
            لیست علاقه‌مندی‌های من
          </Typography>
          <Box />
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} justifyContent="center" paddingTop={5}>
        {fullFavoritesData.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            style={{ marginTop: "50px", marginRight:"25px"}}
          >
            لیست علاقه مندی شما خالی است.
          </Typography>
        ) : (
          fullFavoritesData.map((restaurant) => (
            <Grid item xs={6} sm={4} md={2} key={restaurant.id}>
              <Card
                sx={{
                  position: "relative",
                  padding: 3,
                  borderRadius: "16px",
                  boxShadow: 3,
                  minHeight: "340px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: "100%",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 5 },
                }}
                onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
              >
                <CardMedia
                  component="img"
                  image={
                    restaurant.photo
                      ? restaurant.photo
                      : "https://via.placeholder.com/120"
                  }
                  alt={restaurant.name}
                  sx={{
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ textAlign: "center", paddingBottom: "8px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "'Vazir', sans-serif",
                      fontSize: "1.2rem",
                      color: "#333",
                    }}
                  >
                    {restaurant.name}
                  </Typography>
                </CardContent>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                  }}
                >
                  <IconButton
                    sx={{ color: "#D68240" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromFavorites(restaurant.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#FF1493", pointerEvents: "none" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Favorite />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default FavoritesPage;
