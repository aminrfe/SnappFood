import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Rating,
  Card,
  CardMedia,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const ReviewPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await axiosInstance.get("/customer/orders");
        const orderData = orderResponse.data;
        const selectedOrder = orderData.find(
          (order) => order.order_id === parseInt(id)
        );
        if (selectedOrder) {
          setOrder(selectedOrder);
          const restaurantId = selectedOrder.restaurant;
          const restaurantResponse = await axiosInstance.get(
            "/restaurant/profiles"
          );
          const restaurantData = restaurantResponse.data.restaurants;

          const selectedRestaurant = restaurantData.find(
            (restaurant) => restaurant.id === restaurantId
          );
          if (selectedRestaurant) {
            setRestaurant(selectedRestaurant);
          } else {
            console.error("Restaurant not found");
          }
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order or restaurant data:", error);
      }
    };

    fetchOrders();
  }, [id]);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) {
      alert("لطفاً امتیاز و نظر خود را وارد کنید.");
      return;
    }

    const reviewData = {
      order: parseInt(id),
      score: parseInt(rating),
      description: comment,
    };

    try {
      const response = await axiosInstance.post(
        "/customer/reviews/create",
        reviewData
      );

      if (response.status === 201) {
        alert("نظر با موفقیت ثبت شد.");
        console.log(response.data);
      } else {
        alert("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطای سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#FFEDE0",
        borderRadius: "16px",
        p: 4,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <Card
        sx={{
          backgroundColor: "#FFF8F1",
          p: 2,
          borderRadius: "16px",
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          نظردهی
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          {restaurant ? (
            <CardMedia
              component="img"
              image={`http://127.0.0.1:8000${restaurant.photo}`}
              alt={restaurant.name || "Restaurant Image"}
              sx={{
                width: "250px",
                height: "auto",
                borderRadius: "16px",
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              در حال بارگذاری اطلاعات رستوران...
            </Typography>
          )}
        </Box>

        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: "bold",
          }}
        >
          به سفارش خود امتیاز دهید
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Rating
            name="user-rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
            precision={1}
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#ebcc34",
              },
              "& .MuiRating-iconHover": {
                color: "#ebcc34",
              },
              pointerEvents: "auto",
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
          }}
        >
          برای بهبود کیفیت غذا و خدمات نظرات خود را با ما به اشتراک بگذارید.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="نظر خود را اینجا بنویسید..."
          value={comment}
          onChange={(e) => setComment(e.target.value)} // ذخیره نظر وارد‌شده
          sx={{
            backgroundColor: "#FFEFE7",
            borderRadius: "8px",
            mb: 2,
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#D68240",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            py: 1,
            "&:hover": {
              backgroundColor: "#b56633",
            },
          }}
        >
          ثبت نظر
        </Button>
      </Card>
    </Container>
  );
};

export default ReviewPage;
