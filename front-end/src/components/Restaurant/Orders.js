import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Grid,
  Divider,
} from "@mui/material";

const orders = [
  {
    id: 1,
    name: "سفارش شماره یک",
    date: "پنجشنبه 15 تیر",
    time: "18:07",
    price: "365,500 تومان",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "سفارش شماره دو",
    date: "پنجشنبه 15 تیر",
    time: "18:07",
    price: "365,500 تومان",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "سفارش شماره سه",
    date: "پنجشنبه 15 تیر",
    time: "18:07",
    price: "365,500 تومان",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    name: "سفارش شماره چهار",
    date: "پنجشنبه 15 تیر",
    time: "18:07",
    price: "365,500 تومان",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    name: "سفارش شماره پنج",
    date: "پنجشنبه 15 تیر",
    time: "18:07",
    price: "365,500 تومان",
    image: "https://via.placeholder.com/100",
  },
];

const OrderList = () => {
  return (
    <Box
      sx={{ backgroundColor: "#FFFFFF", padding: "2rem", minHeight: "100vh" }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", marginBottom: "2rem" }}
      >
        لیست سفارش‌ها
      </Typography>

      <Grid container justifyContent="center">
        {orders.map((order) => (
          <Grid item xs={12} md={8} key={order.id}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#F4DCC9",
                boxShadow: "none",
                borderRadius: 0,
                overflow: "hidden",
              }}
            >
              {/* Image Section */}
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100 }}
                image={order.image}
                alt={order.name}
              />

              {/* Content Section */}
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    {order.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.date} - {order.time}
                  </Typography>
                </CardContent>
              </Box>

              <Box sx={{ padding: "1rem" }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    //   color: "#D9534F",
                    marginTop: "0.5rem",
                  }}
                >
                  {order.price}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#F79367",
                    color: "white",
                    "&:hover": { backgroundColor: "primary" },
                    fontWeight: "normal !important",
                  }}
                >
                  وارد کردن وضعیت سفارش
                </Button>
              </Box>
              <Divider  />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrderList;
