import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
} from "@mui/material";

const MyOrders = () => {
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
    <Box sx={{ padding: { xs: 2, sm: 3 }, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          marginBottom: 3,
          color: "#D68240",
          fontWeight: "bold",
        }}
      >
        سفارش‌های من
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
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
