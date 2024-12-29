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
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import publicAxiosInstance from "../../utills/publicAxiosInstance";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [description, setDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartID, setCartID] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);

  const DELIVERY_COST =
    deliveryMethod === "delivery" ? Math.floor(parseInt(deliveryCost)) : 0;
  const discount = cartItems.reduce(
    (acc, item) => acc + item.price * (item.discount / 100) * item.count,
    0
  );
  const tax = Math.round(parseInt(totalPrice) * 0.09);
  const totalAfterDiscount = parseInt(totalPrice) - discount;
  const finalAmount = totalAfterDiscount + tax + DELIVERY_COST;

  useEffect(() => {
    fetchProfileData();
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

  const fetchProfileData = async () => {
    try {
      const response = await publicAxiosInstance.get(
        `/restaurant/profiles/${restaurantId}`
      );

      const data = response.data;

      if (data) {
        setDeliveryCost(data.delivery_price || 0);
      } else {
        console.error("No restaurant data received from API");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
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
      <AppBar position="static" sx={{ backgroundColor: "#F4DCC9" }}>
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
              paddingRight: "60px",
            }}
          >
            سبد خرید من
          </Typography>
        </Toolbar>
      </AppBar>

      {/* محتوای سبد خرید */}
      <Container
        maxWidth="md"
        sx={{ mt: 3, mb: 8, backgroundColor: "#fffbf7", borderRadius: 2 }}
      >
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.photo}
                  alt={item.name}
                  sx={{ width: 100, height: 100 }}
                  onClick={() =>
                    navigate(`/restaurant/${restaurantId}/${item.item}`)
                  }
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="#D68240"
                    sx={{
                      pointerEvents: "none",
                      userSelect: "none",
                      textDecoration:
                        item.discount > 0 ? "line-through" : "none",
                      color: item.discount > 0 ? "gray" : "black",
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
                      }}
                    >
                      {Math.floor(
                        item.price - (item.price * item.discount) / 100
                      ).toLocaleString()}{" "}
                      تومان
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <Add />
                  </IconButton>
                  <Typography variant="h6">{item.count}</Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <Remove />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* توضیحات */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            توضیحات
          </Typography>
          <TextField
            placeholder="توضیحات سفارش خود را اینجا بنویسید..."
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* انتخاب روش تحویل */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            انتخاب روش تحویل
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label="تحویل حضوری"
              />
              <FormControlLabel
                value="delivery"
                control={<Radio />}
                label={`تحویل با پیک (${Math.floor(
                  deliveryCost
                ).toLocaleString()}) تومان`}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* محاسبات */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>جمع سفارش:</Typography>
          <Typography>
            {Math.floor(parseInt(totalPrice)).toLocaleString()} تومان
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography color="success">سود شما از این خرید:</Typography>
          <Typography color="success">
            -{discount.toLocaleString()} تومان
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>مجموع اقلام پس از تخفیف:</Typography>
          <Typography>
            {(totalPrice - discount).toLocaleString()} تومان
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>هزینه ارسال:</Typography>
          <Typography>{DELIVERY_COST.toLocaleString()} تومان</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>مالیات (۹٪):</Typography>
          <Typography>{tax.toLocaleString()} تومان</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            مبلغ قابل پرداخت:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#D68240">
            {finalAmount.toLocaleString()} تومان
          </Typography>
        </Box>

        {/* دکمه ادامه خرید */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/checkout")}
            sx={{ fontSize: "1.1rem" }}
            style={{ padding: "10px 15px" }}
          >
            ادامه خرید
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CartPage;
