import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Rating,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axiosInstance from "../../utills/publicAxiosInstance.js";

const FoodItemPage = () => {
  const { id, item_id } = useParams();
  const [foodData, setFoodData] = useState([]);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await axiosInstance.get(
          `/customer/restaurants/${id}/items/${item_id}`
        );
        console.log(response.data);
        setFoodData(response.data);
      } catch (error) {
        console.error("Error fetching food item:", error);
      }
    };
    fetchFoodItem();
  }, [id, item_id]);

  const finalPrice = foodData.price
    ? foodData.price - (foodData.price * (foodData.discount || 0)) / 100
    : 0;

  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => Math.max(prevQuantity + delta, 0));
  };

  const handleAddToCart = () => {
    setShowQuantitySelector(true);
    setQuantity(1); // مقدار تعداد به 1 تغییر می‌کند
    console.log("Item added to cart"); // اینجا می‌توانید تابع مدیریت سبد خرید را اضافه کنید.
  };

  const comments = [
    {
      id: 1,
      name: "اسم کاربر 1",
      date: "۱۸ آبان ۱۴۰۳",
      rating: 4,
      comment: "Really convenient and the points system helps benefit loyalty",
    },
    {
      id: 2,
      name: "اسم کاربر 2",
      date: "۱۸ آبان ۱۴۰۳",
      rating: 4,
      comment: "Really convenient and the points system helps benefit",
    },
    {
      id: 3,
      name: "اسم کاربر 3",
      date: "۱۸ آبان ۱۴۰۳",
      rating: 4,
      comment:
        "glitches here and there, but nothing too egregious. Obviously needs to roll out to more remote.",
    },
  ];

  return (
    <Grid
      container
      gap={8}
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid>
        <Box sx={{ position: "relative", width: "fit-content" }}>
		{foodData.discount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "red",
                color: "white",
                padding: "4px 8px",
                borderRadius: "8px",
              }}
            >
              {foodData.discount}% تخفیف
            </Box>
          )}
          <img
            src={foodData.photo}
            alt="Food"
            style={{
              height: "300px",
              display: "block",
              borderRadius: 18,
            }}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="row"
          gap={2}
          alignItems="center"
          py={1}
        >
          <Chip label={foodData.score} />
          <Chip label="۲۰ دقیقه" />
          <Chip label="رایگان" />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h6" sx={{ pointerEvents: "none", py: 1 }}>
            {foodData.name}
          </Typography>
        </Box>
      </Grid>

      <Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="body2"
          sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
        >
          {foodData.description}
        </Typography>

		<Box display="flex" alignItems="center" justifyContent="space-between">
  			<Box display="flex" alignItems="center" gap={1}>
  			  <Typography
  			    sx={{
  			      textDecoration: foodData.discount > 0 ? "line-through" : "none",
  			      color: foodData.discount > 0 ? "gray" : "black",
  			    }}
  			  >
  			    {Math.floor(foodData.price)?.toLocaleString()} تومان
  			  </Typography>
  			  {foodData.discount > 0 && (
  			    <Typography sx={{ color: "green", fontWeight: "bold" }}>
  			      {(finalPrice).toLocaleString()} تومان
  			    </Typography>
  			  )}
  			</Box>
  			{quantity === 0 ? (
  			  <Button
  			    variant="contained"
  			    color="success"
  			    size="small"
  			    onClick={handleAddToCart}
  			  >
  			    افزودن
  			  </Button>
  			) : (
  			  <Box display="flex" alignItems="center" gap={1}>
  			    <IconButton
  			      onClick={() => handleQuantityChange(-1)}
  			      disabled={quantity === 0}
  			    >
  			      <RemoveIcon />
  			    </IconButton>
  			    <Typography>{quantity}</Typography>
  			    <IconButton onClick={() => handleQuantityChange(1)}>
  			      <AddIcon />
  			    </IconButton>
  			  </Box>
  			)}
		</Box>

        <Button variant="contained" color="primary" fullWidth>
          مشاهده سبد خرید
        </Button>
      </Grid>

      <Grid>
        <Box
          sx={{
            width: { lg: "500px" },
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ mb: 3, fontWeight: "bold", pointerEvents: "none" }}
          >
            نظر کاربران
          </Typography>
          <Box
            sx={{
              maxHeight: "700px",
              overflowY: "auto",
              pr: 1,
            }}
          >
            {comments.map((comment) => (
              <Grid
                item
                key={comment.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  borderBottom: "1px solid #e0e0e0",
                  pb: 2,
                  mb: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ bgcolor: "#D68240" }}>
                    {comment.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ pointerEvents: "none" }}
                    >
                      {comment.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ pointerEvents: "none" }}
                    >
                      {comment.date}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Rating
                    value={comment.rating}
                    readOnly
                    precision={0.5}
                    sx={{ color: "orange" }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ pointerEvents: "none" }}
                >
                  {comment.comment}
                </Typography>
              </Grid>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FoodItemPage;
