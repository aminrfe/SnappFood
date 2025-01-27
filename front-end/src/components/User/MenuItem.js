import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Rating,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axiosInstance from "../../utills/publicAxiosInstance.js";
import privateAxiosInstance from "../../utills/axiosInstance.js";
import publicAxiosInstance from "../../utills/publicAxiosInstance.js";

const FoodItemPage = () => {
  const navigate = useNavigate();
  const { id, item_id } = useParams();
  const [foodData, setFoodData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [Item, setItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartID, setCartID] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    fetchFoodItem();
    fetchCartData();
  }, [id, item_id, isLoggedIn]);

  const checkLoginStatus = async () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    setIsLoggedIn(!!(accessToken && refreshToken));
  };

  const handleViewCartClick = async () => {
    if (isLoggedIn) {
      navigate(`/cart?restaurant_id=${id}`);
    } else {
      alert("ابتدا وارد حساب کاربری خود شوید.");
    }
  };

  const fetchFoodItem = async () => {
    try {
      const response = await publicAxiosInstance.get(
        `/customer/restaurants/${id}/items/${item_id}`
      );
      setFoodData(response.data);
    } catch (error) {
      console.error("Error fetching food item:", error);
    }
  };

  const fetchCartData = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await privateAxiosInstance.get("/customer/carts", {
        params: { restaurant_id: id },
      });

      const filteredData = response.data.filter(
        (cart) => cart.restaurant === parseInt(id)
      );

      const myCart = filteredData[0].cart_items || [];
      const item = myCart.find((i) => i.item === parseInt(item_id));

      if (item) {
        setItem(item);
      } else {
        setItem({ count: 0 });
      }

      setCartID(parseInt(filteredData[0].id));
      setTotalPrice(parseInt(filteredData[0].total_price));
      setCartItems(myCart);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات سبد خرید:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      await privateAxiosInstance.post("/customer/carts", {
        restaurant_id: id,
        item_id: parseInt(item_id),
        count: 1,
      });

      alert("آیتم به سبد خرید شما اضافه شد");
      fetchCartData();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleQuantityChange = async (delta) => {
    try {
      const newCount = Item.count + delta;
      if (newCount < 1) return;

      const response = await privateAxiosInstance.put(
        `/customer/carts/${cartID}`,
        {
          cart_item_id: Item.id,
          count: newCount,
        }
      );
      fetchCartData();
    } catch (error) {
      console.error(
        "خطا در به‌روزرسانی تعداد آیتم:",
        error.response?.data || error
      );
    }
  };

  return (
    <Grid
      container
      gap={8}
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{ position: "relative", width: "fit-content", margin: "auto" }}
        >
          {foodData.discount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "red",
                color: "white",
                padding: "4px 8px",
                borderRadius: "8px",
              }}
            >
              {foodData.discount}% تخفیف
            </Box>
          )}
          <img
            src={
              foodData.photo
                ? foodData.photo
                : "https://via.placeholder.com/120"
            }
            alt="Food"
            style={{
              height: "300px",
              display: "block",
              borderRadius: 18,
              margin: "auto",
            }}
          />
        </Box>
        
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h6" sx={{ pointerEvents: "none", py: 1 }}>
            {foodData.name}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
        >
          {foodData.description}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              sx={{
                textDecoration: foodData.discount > 0 ? "line-through" : "none",
                color: foodData.discount > 0 ? "gray" : "black",
              }}
            >
              {Math.floor(foodData.price)?.toLocaleString()} تومان
            </Typography>
            {foodData.discount > 0 && (
              <Typography sx={{ color: "green", fontWeight: "bold" }}>
                {(
                  foodData.price -
                  (foodData.price * foodData.discount) / 100
                ).toLocaleString()}{" "}
                تومان
              </Typography>
            )}
          </Box>
          {!isLoggedIn || !Item || Item.count === 0 ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleAddToCart}
            >
              افزودن
            </Button>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={Item.count === 0}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{Item.count}</Typography>
              <IconButton onClick={() => handleQuantityChange(1)}>
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleViewCartClick}
        >
          مشاهده سبد خرید
        </Button>
      </Grid>
    </Grid>
  );
};

export default FoodItemPage;
