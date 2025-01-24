import React, { useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
} from "@mui/material";
import axiosInstance from "../../utills/axiosInstance";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const {
    totalPrice,
    discount,
    tax,
    shippingCost,
    itemsTotal,
    deliveryMethod,
    cartID,
    description,
  } = location.state || {};
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleOrderSubmit = async () => {
    try {
      const response = await axiosInstance.post("/customer/orders", {
        cart_id: cartID,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        description: description,
      });

      if (response.status === 201) {
        // نمایش پیام موفقیت با alert
        alert("سفارش با موفقیت ثبت شد!");

        // هدایت به صفحه پیگیری سفارش
        navigate("/track-order");
      }
    } catch (error) {
      console.error("خطا در ثبت سفارش:", error.response?.data || error);

      // نمایش پیام خطا با alert
      alert("خطا در ثبت سفارش! لطفا دوباره تلاش کنید.");
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
            تأیید نهایی و پرداخت
          </Typography>
        </Toolbar>
      </AppBar>

      {/* محتوای صفحه */}
      <Container
        maxWidth="md"
        sx={{ mt: 3, mb: 8, backgroundColor: "#fffbf7", borderRadius: 2, p: 3 }}
      >
        {/* انتخاب آدرس */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            انتخاب آدرس
          </Typography>
          <FormControl>
            <RadioGroup>
              <FormControlLabel
                control={<Radio />}
                label="آدرس ذخیره شده شما"
              />
            </RadioGroup>
          </FormControl>
          <Box sx={{ textAlign: "left" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/user/edit-profile")}
            >
              تغییر آدرس
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* انتخاب روش پرداخت */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            انتخاب روش پرداخت
          </Typography>
          <FormControl>
            <RadioGroup
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              sx={{ mt: 2 }}
            >
              <FormControlLabel
                value="online"
                control={<Radio />}
                label="پرداخت آنلاین"
              />
              <FormControlLabel
                value="in_person"
                control={<Radio />}
                label="پرداخت در محل"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Divider sx={{ my: 4 }} />

        {/* جزئیات پرداخت */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            جزئیات پرداخت
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>جمع سفارش:</Typography>
            <Typography>{itemsTotal?.toLocaleString()} تومان</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography color="success">سود شما از این خرید:</Typography>
            <Typography color="success">
              -{discount?.toLocaleString()} تومان
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>مجموع اقلام پس از تخفیف:</Typography>
            <Typography>
              {(itemsTotal - discount)?.toLocaleString()} تومان
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>هزینه ارسال:</Typography>
            <Typography>{shippingCost?.toLocaleString()} تومان</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>مالیات (۹٪):</Typography>
            <Typography>{tax?.toLocaleString()} تومان</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              مبلغ قابل پرداخت:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#D68240">
              {totalPrice?.toLocaleString()} تومان
            </Typography>
          </Box>
        </Box>

        {/* دکمه پرداخت */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrderSubmit}
            sx={{ fontSize: "1.1rem", padding: "10px 15px" }}
          >
            پرداخت
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
