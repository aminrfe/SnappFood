import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";
import { useNavigate, useSearchParams  } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const CartPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartID, setCartID] = useState(0);

  useEffect(() => {

    if (restaurantId) {
      fetchCartData();
    }
  }, [restaurantId]);

  const fetchCartData = async () => {
    try {
      const response = await axiosInstance.get("/customer/carts", {
        params: { restaurant_id: restaurantId }, 
      });

      const filteredData = response.data.filter(
        (cart) => cart.restaurant === parseInt(restaurantId) 
      );
      setCartID(parseInt(filteredData[0].id));
      setTotalPrice(parseInt(filteredData[0].total_price));
      setCartItems(response.data?.[0]?.cart_items);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات سبد خرید:", error);
    }
  };


  const handleQuantityChange = async (cartItemId, delta) => {
    try {
      const item = cartItems.find((item) => item.id === cartItemId);
      if (!item) return;
  
      const newCount = item.count + delta;
      if (newCount < 1) return;
  
      const response = await axiosInstance.put(`/customer/carts/${cartID}`, {
        cart_item_id: cartItemId, // شناسه آیتم
        count: newCount, // مقدار جدید
      });  
      fetchCartData();
    } catch (error) {
      console.error("خطا در به‌روزرسانی تعداد آیتم:", error.response?.data || error);
    }
  };
  

  const handleDeleteItem = async (cartItemId) => {
    try {
      await axiosInstance.delete(`/customer/carts/${cartID}/items/${cartItemId}`);
  
      fetchCartData();
    } catch (error) {
      console.error("خطا در حذف آیتم:", error.response?.data || error);
    }
  };


  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", maxWidth:"70%", margin:"auto"}}>
      {/* هدر */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#F4DCC9", 
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img
            src={FoodiLogo}
            alt="Foodi Logo"
            style={{ width: "100px", cursor: "pointer" }}
            onClick={ () => navigate("/")}
          />
          <Typography
            variant="h5"
            sx={{
              color: "#D68240", 
              fontWeight: "bold",
              flex: 1, 
              textAlign: "center",
              userSelect: "none",
              pointerEvents: "none",
              paddingRight:"50px",
            }}
          >
             سبد خرید من
          </Typography>
          <Box />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 3, mb: 8, backgroundColor:"#fffbf7"}}>
        {/* لیست آیتم‌ها */}
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                {/* تصویر */}
                <CardMedia
                  component="img"
                  image={item.photo}
                  alt={item.name}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />

                {/* جزئیات */}
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold"
                  sx={{ cursor:"pointer"}}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary"
                  sx={{ pointerEvents: "none", userSelect: "none" }}>
                    {item.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#D68240"
                    sx={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {Math.floor(item.price).toLocaleString()} تومان
                  </Typography>
                </CardContent>

                {/* دکمه‌های تغییر تعداد */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {/* دکمه حذف */}
                <IconButton
                  color="error"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Delete />
                </IconButton>  
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <Add />
                  </IconButton>
                  <Typography 
                  variant="h6"
                  sx={{ pointerEvents: "none", userSelect: "none" }}>
                    {item.count}</Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <Remove />
                  </IconButton>
                </Box>

              </Card>
            </Grid>
          ))}
        </Grid>

        {/* جمع کل */}
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold"
          sx={{ pointerEvents: "none", userSelect: "none" }}>
            جمع کل:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#D68240"
          sx={{ pointerEvents: "none", userSelect: "none" }}>
            {Math.floor(totalPrice).toLocaleString()} تومان
          </Typography>
        </Box>

        {/* دکمه تکمیل خرید */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4caf50", 
              color: "#fff",
              fontSize: "1.1rem",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#388e3c", 
              },
            }}
            style={{padding:"10px 15px"}}
          >
            تکمیل خرید
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CartPage;
