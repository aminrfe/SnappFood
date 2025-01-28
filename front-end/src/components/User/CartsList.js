import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const CartsList = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const handleDeleteItem = async (id) => {
    try {
      const response = await axiosInstance.delete(`/customer/carts/${id}`);

      if (response.status === 200) {
        alert(`کارت با موفقیت حذف شد.`);
        fetchCartData();
      } else {
        alert("حذف کارت ناموفق بود.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("کارت پیدا نشد.");
      } else {
        alert("خطا در حذف کارت. لطفاً دوباره تلاش کنید.");
      }
      console.error("خطا در حذف کارت:", error);
    }
  };

  const handleContinueShopping = (resID) => {
    navigate(`/customer/carts?restaurant_id=${resID}`);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await axiosInstance.get("/customer/carts");
      const carts = response.data;

      const updatedCarts = await Promise.all(
        carts.map(async (cart) => {
          try {
            const profileResponse = await axiosInstance.get(
              `/restaurant/profiles/${cart.restaurant}`
            );
            const restaurantProfile = profileResponse.data;

            return {
              ...cart,
              photo: restaurantProfile.photo,
            };
          } catch (error) {
            console.error(
              `خطا در دریافت اطلاعات رستوران برای کارت با آیدی ${cart.restaurant}:`,
              error
            );
            return cart;
          }
        })
      );
      setCartItems(updatedCarts);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات سبد خرید:", error);
    }
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
        <Grid container spacing={2} justifyContent="center">
          {cartItems.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              style={{ marginTop: "40px" }}
            >
              در حال حاضر سبد خرید فعالی ندارید.
            </Typography>
          ) : (
            cartItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card
                  sx={{
                    display: "flex",
                    margin: "auto",
                    justifyContent: "space-between",
                    maxWidth: "820px",
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        item.photo
                          ? item.photo
                          : "https://via.placeholder.com/120"
                      }
                      alt={item.restaurant_name}
                      sx={{
                        width: 150,
                        height: 150,
                        borderRadius: "8px",
                      }}
                      onClick={() => navigate(`//${item.restaurant}`)}
                    />
                    <Typography
                      variant="h6"
                      sx={{ mt: 1, textAlign: "center", fontSize: "16px" }}
                    >
                      {item.restaurant_name}
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
                      onClick={() => handleContinueShopping(item.restaurant)}
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
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CartsList;
