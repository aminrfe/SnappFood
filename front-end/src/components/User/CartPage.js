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
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const CartPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartID, setCartID] = useState(0);

  const totalDiscount = cartItems.reduce(
    (acc, item) => acc + item.price * (item.discount / 100) * item.count,
    0
  );

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

      const filteredData = response?.data.filter(
        (cart) => cart.restaurant === parseInt(restaurantId)
      );
      if (filteredData?.length !== 0) {
        setCartID(parseInt(filteredData[0].id));
        setTotalPrice(parseInt(filteredData[0].total_price));
        setCartItems(response.data?.[0]?.cart_items);
      }
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
        cart_item_id: cartItemId,
        count: newCount,
      });
      fetchCartData();
    } catch (error) {
      console.error(
        "خطا در به‌روزرسانی تعداد آیتم:",
        error.response?.data || error
      );
    }
  };

  const handleDeleteItem = async (cartItemId) => {
    try {
      await axiosInstance.delete(
        `/customer/carts/${cartID}/items/${cartItemId}`
      );
      alert("آیتم با موفقیت از سبد خرید شما حذف شد");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      setTotalPrice(
        (prevTotal) =>
          prevTotal - cartItems.find((item) => item.id === cartItemId)?.price
      );
      fetchCartData();
    } catch (error) {
      console.error("خطا در حذف آیتم:", error.response?.data || error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        maxWidth: "70%",
        margin: "auto",
      }}
    >
      {/* هدر */}
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
            variant="h5"
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
            سبد خرید من
          </Typography>
          <Box />
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{ mt: 3, mb: 8, backgroundColor: "#fffbf7" }}
      >
        {cartItems.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              textAlign: "center",
              marginTop: "50px",
              userSelect: "none",
            }}
          >
            سبد خرید شما خالی است.
           </Typography>
        ) : (
          <>
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
          image={item.photo ? item.photo : "https://via.placeholder.com/120"}
          alt={item.name}
          sx={{
            width: 100,
            height: 100,
            borderRadius: 2,
            objectFit: "cover",
          }}
          onClick={() =>
            navigate(`/customer/restaurants/${restaurantId}/${item.item}`)
          }
        />

        {/* جزئیات */}
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              cursor: "pointer",
              fontSize: { xs: "0.9rem", sm: "1rem" }, // تغییر اندازه فونت
            }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ pointerEvents: "none", userSelect: "none" }}
          >
            {item.description}
          </Typography>
          <Typography
            variant="subtitle1"
            color="#D68240"
            sx={{
              pointerEvents: "none",
              userSelect: "none",
              textDecoration: item.discount > 0 ? "line-through" : "none",
              color: item.discount > 0 ? "gray" : "#D68240",
              fontSize: { xs: "0.8rem", sm: "1rem" }, // تغییر اندازه فونت
              display: "inline",
            }}
          >
            {Math.floor(item.price).toLocaleString()} تومان
          </Typography>
          {item.discount > 0 && (
            <Typography
              color="#D68240"
              sx={{
                fontWeight: "bold",
                display: "inline",
                marginLeft: "15px",
                fontSize: { xs: "0.9rem", sm: "1rem" }, // تغییر اندازه فونت
              }}
            >
              {Math.floor(
                item.price - (item.price * item.discount) / 100
              ).toLocaleString()}{" "}
              تومان
            </Typography>
          )}
        </CardContent>

        {/* دکمه‌های تغییر تعداد */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
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
            sx={{
              pointerEvents: "none",
              userSelect: "none",
              fontSize: { xs: "0.9rem", sm: "1rem" }, // تغییر اندازه فونت
            }}
          >
            {item.count}
          </Typography>
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
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ pointerEvents: "none", userSelect: "none" }}
              >
                جمع کل:
              </Typography>
              <Typography
                variant="h6"
                color="#D68240"
                sx={{
                  pointerEvents: "none",
                  userSelect: "none",
                  textDecoration: totalDiscount > 0 ? "line-through" : "none",
                  color: totalDiscount > 0 ? "gray" : "#D68240",
                  display: "inline",
                }}
              >
                {Math.floor(totalPrice).toLocaleString()} تومان
              </Typography>
              {totalDiscount > 0 && (
                <Typography
                  color="#D68240"
                  variant="h6"
                  sx={{ fontWeight: "bold", display: "inline" }}
                >
                  {Math.floor(totalPrice - totalDiscount).toLocaleString()}{" "}
                  تومان
                </Typography>
              )}
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
                style={{ padding: "10px 15px" }}
                onClick={() =>
                  navigate(`/customer/carts/${cartID}/cart-completion?restaurant_id=${restaurantId}`)
                }
              >
                تکمیل خرید
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;
