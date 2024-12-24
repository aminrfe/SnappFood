import React, { useState } from "react";
import { Container, Grid, Box, Typography, Card, CardMedia, Button } from "@mui/material";
import food1 from "../../assets/imgs/food1.png";
import food2 from "../../assets/imgs/food2.png";

const CartsList = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "اسم رستوران نمونه 1", image: food1 },
    { id: 2, name: "اسم رستوران نمونه 2", image: food2 },
  ]);

  const handleDeleteItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleContinueShopping = (id) => {
    alert(`ادامه خرید برای ${id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "820px",
          margin: "0 auto",
          backgroundColor: "#D68240",
          padding: "16px",
          textAlign: "center",
          borderRadius: "8px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
          لیست سبد خرید ها
        </Typography>
      </Box>

      {/* Cart Items */}
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: "8px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ mt: 1, textAlign: "center", fontSize: "16px" }}
                  >
                    {item.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleDeleteItem(item.id)}
                    sx={{
                      minWidth: "100px",
                      borderRadius: "20px",
                      backgroundColor: "#ff8c00",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#e67e00",
                      },
                    }}
                  >
                    حذف سبد
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleContinueShopping(item.id)}
                    sx={{
                      minWidth: "100px",
                      borderRadius: "20px",
                      backgroundColor: "#ff1493",
                    }}
                  >
                    ادامه خرید
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CartsList;
