import React from "react";
import { Container, Typography, Card, CardContent, Grid, Box } from "@mui/material";
import food1 from "../../assets/imgs/food1.png";
import food2 from "../../assets/imgs/food2.png";
import food3 from "../../assets/imgs/food3.png";

const soldItems = [
  { name: "اسم غذای نمونه 1", quantity: 5, price: 300000, image: food1 },
  { name: "اسم غذای نمونه 2", quantity: 5, price: 300000, image: food2 },
  { name: "اسم غذای نمونه 3", quantity: 5, price: 300000, image: food3 },
];

const totalRevenue = 900000;

const RestaurantReportPage = () => {
  return (
    <Container sx={{ marginTop: 4, width: "70%" }}> 
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#f5d5c0",
          padding: 2,
          borderRadius: 1,
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ color: "#D68240", cursor: "default", 
                    pointerEvents: "none",  }}>
          گزارش مالی فروشگاه
        </Typography>
      </Box>

      {/* List of Sold Items */}
      <Grid container spacing={2}>
        {soldItems.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", padding: 1, backgroundColor: "#FFFFFF" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "75px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginRight: "16px", 
                }}
              />
              <CardContent sx={{ flex: 1, paddingLeft: "16px", paddingTop: 0, paddingBottom: 0 }}> 
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    cursor: "default", /* Ensure no pointer cursor */
                    pointerEvents: "none", /* Disable all interactions */
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    color: "#7D7D7D",
                    cursor: "default", 
                    pointerEvents: "none", 
                  }}
                >
                  تعداد فروش: {item.quantity}
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    color: "#7D7D7D",
                    cursor: "default",
                    pointerEvents: "none", 
                  }}
                >
                  مجموع قیمت: {item.price.toLocaleString()} تومان
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Total Revenue */}
      <Box
        sx={{
          marginTop: 3,
          backgroundColor: "#f5d5c0",
          padding: 2,
          borderRadius: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="div" sx={{ color: "#D68240"  , cursor: "default", 
                    pointerEvents: "none",  }}>
          مجموع درآمد در ماه: {totalRevenue.toLocaleString()} تومان
        </Typography>
      </Box>
    </Container>
  );
};

export default RestaurantReportPage;
