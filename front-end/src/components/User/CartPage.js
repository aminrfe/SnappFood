import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "پیتزا مخصوص",
      description: "پیتزا مخصوص با پنیر اضافه و سس ویژه",
      price: 150000,
      quantity: 1,
      image: "https://via.placeholder.com/120",
    },
    {
      id: 2,
      name: "برگر دوبل",
      description: "برگر دوبل همراه با سیب‌زمینی سرخ‌کرده",
      price: 120000,
      quantity: 2,
      image: "https://via.placeholder.com/120",
    },
    {
      id: 3,
      name: "سالاد سزار",
      description: "سالاد سزار با مرغ گریل شده و سس مخصوص",
      price: 95000,
      quantity: 1,
      image: "https://via.placeholder.com/120",
    },
  ]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* هدر */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#F4DCC9", // رنگ هدر از پالت شما
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
              color: "#D68240", // رنگ سفید برای نوشته
              fontWeight: "bold",
              flex: 1, // وسط چین
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
                  image={item.image}
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
                    {item.price.toLocaleString()} تومان
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
                    {item.quantity}</Typography>
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
            {totalPrice.toLocaleString()} تومان
          </Typography>
        </Box>

        {/* دکمه تکمیل خرید */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4caf50", // رنگ دکمه از پالت شما
              color: "#fff",
              fontSize: "1.1rem",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#388e3c", // رنگ هاور
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
