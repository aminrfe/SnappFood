import React, { useState } from "react";
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
import food1 from "../../assets/imgs/food1.png";

const ReviewPage = () => {
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState(""); 

  const handleSubmit = () => {
    alert(`امتیاز: ${rating}, نظر: ${comment}`);
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
          <CardMedia
            component="img"
            image={food1}
            alt="Food Image"
            sx={{
              width: "250px",
              height: "auto",
              borderRadius: "16px",
            }}
          />
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
            onChange={(event, newValue) => {
              console.log(`Selected Rating: ${newValue}`); 
              setRating(newValue);
            }}
            size="large"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#D68240", 
              },
              "& .MuiRating-iconHover": {
                color: "#b56633", 
              },
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
          onChange={(e) => setComment(e.target.value)}
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
