import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Toolbar,
  AppBar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";

const MyOrders = () => {
   const navigate = useNavigate();
  const orders = [
    {
      id: 1,
      title: "سفارش شماره یک",
      date: "۱۸:۰۷ | یک شنبه",
      price: 365500,
      status: "تحویل شده",
      details: "اطلاعات مربوط به سفارش شامل توضیحات و...",
      image: require("../../assets/imgs/food1.png"),
    },
    {
      id: 2,
      title: "سفارش شماره دو",
      date: "۱۸:۰۷ | یک شنبه",
      price: 365500,
      status: "تحویل شده",
      details: "اطلاعات مربوط به سفارش شامل توضیحات و...",
      image: require("../../assets/imgs/food1.png"),
    },
    {
      id: 3,
      title: "سفارش شماره سه",
      date: "۱۸:۰۷ | یک شنبه",
      price: 365500,
      status: "تحویل شده",
      details: "اطلاعات مربوط به سفارش شامل توضیحات و...",
      image: require("../../assets/imgs/food1.png"),
    },
    {
      id: 4,
      title: "سفارش شماره چهار",
      date: "۱۸:۰۷ | یک شنبه",
      price: 365500,
      status: "تحویل شده",
      details: "اطلاعات مربوط به سفارش شامل توضیحات و...",
      image: require("../../assets/imgs/food1.png"),
    },
    {
      id: 5,
      title: "سفارش شماره چهار",
      date: "۱۸:۰۷ | یک شنبه",
      price: 365500,
      status: "تحویل شده",
      details: "اطلاعات مربوط به سفارش شامل توضیحات و...",
      image: require("../../assets/imgs/food1.png"),
    },
    {
      id: 6,
      title: "سفارش شماره چهار",
      date: "۱۸:۰۷ | یک شنبه",
      price: 365500,
      status: "تحویل شده",
      details: "اطلاعات مربوط به سفارش شامل توضیحات و...",
      image: require("../../assets/imgs/food1.png"),
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5F5",
        minHeight: "100vh",
      }}
    >
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
           سفارش های من
          </Typography>
          <Box />
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} justifyContent="center" padding="20px">
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id} >
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                padding: 2,
                backgroundColor: "#FFF5ED",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <CardMedia
                component="img"
                image={order.image}
                alt={order.title}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  borderRadius: 2,
                  objectFit: "cover",
                  marginLeft: { sm: 2 },
                  marginBottom: { xs: 2, sm: 0 },
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ marginBottom: 1, color: "#333" }}
                >
                  {order.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: 1 }}
                >
                  {order.date}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: "#D68240", marginBottom: 1 }}
                >
                  {order.price.toLocaleString()} تومان
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  {order.details}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ backgroundColor: "#FF7043" }}
                >
                  سفارش مجدد
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyOrders;
