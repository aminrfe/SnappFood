import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import FoodiLogo from "../../assets/imgs/foodiIcon.png";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "پیتزا مخصوص", description: "پیتزا مخصوص با پنیر اضافه و سس ویژه", price: 150000, quantity: 1, discount: 10, image: "https://via.placeholder.com/120" },
    { id: 2, name: "برگر دوبل", description: "برگر دوبل همراه با سیب‌زمینی سرخ‌کرده", price: 120000, quantity: 2, discount: 5, image: "https://via.placeholder.com/120" },
    { id: 3, name: "سالاد سزار", description: "سالاد سزار با مرغ گریل شده و سس مخصوص", price: 95000, quantity: 1, discount: 8, image: "https://via.placeholder.com/120" },
  ]);

  const [description, setDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // پیش‌فرض: تحویل حضوری

  const DELIVERY_COST = deliveryMethod === "delivery" ? 20000 : 0; // هزینه ارسال
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.discount / 100)) * item.quantity,
    0
  );
  const tax = Math.round(totalPrice * 0.09); // 9 درصد مالیات
  const totalAfterDiscount = totalPrice - discount;
  const finalAmount = totalAfterDiscount + tax + DELIVERY_COST;

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* هدر */}
      <AppBar position="static" sx={{ backgroundColor: "#F4DCC9" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img src={FoodiLogo} alt="Foodi Logo" style={{ width: "100px", cursor: "pointer" }} onClick={() => navigate("/")} />
          <Typography variant="h5" sx={{ color: "#D68240", fontWeight: "bold", flex: 1, textAlign: "center", paddingRight:"60px"}}>
            سبد خرید من
          </Typography>
        </Toolbar>
      </AppBar>

      {/* محتوای سبد خرید */}
      <Container maxWidth="md" sx={{ mt: 3, mb: 8, backgroundColor: "#fffbf7", borderRadius: 2 }}>
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card sx={{ display: "flex", justifyContent: "space-between", p: 2, boxShadow: 2, borderRadius: 2 }}>
                <CardMedia component="img" image={item.image} alt={item.name} sx={{ width: 100, height: 100 }} />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="#D68240">{item.price.toLocaleString()} تومان</Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton color="primary" onClick={() => handleQuantityChange(item.id, 1)}><Add /></IconButton>
                  <Typography variant="h6">{item.quantity}</Typography>
                  <IconButton color="primary" onClick={() => handleQuantityChange(item.id, -1)}><Remove /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteItem(item.id)}><Delete /></IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* توضیحات */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">توضیحات</Typography>
          <TextField
            placeholder="توضیحات سفارش خود را اینجا بنویسید..."
            multiline rows={3} fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* انتخاب روش تحویل */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">انتخاب روش تحویل</Typography>
          <FormControl component="fieldset">
            <RadioGroup row value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
              <FormControlLabel value="pickup" control={<Radio />} label="تحویل حضوری" />
              <FormControlLabel value="delivery" control={<Radio />} label="تحویل با پیک (۲۰,۰۰۰ تومان)" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* محاسبات */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>جمع سفارش:</Typography>
          <Typography>{totalPrice.toLocaleString()} تومان</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography color="success">سود شما از این خرید:</Typography>
          <Typography color="success">-{discount.toLocaleString()} تومان</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>مجموع اقلام پس از تخفیف:</Typography>
          <Typography>{(totalPrice - discount).toLocaleString()} تومان</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>هزینه ارسال:</Typography>
          <Typography>{DELIVERY_COST.toLocaleString()} تومان</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>مالیات (۹٪):</Typography>
          <Typography>{tax.toLocaleString()} تومان</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">مبلغ قابل پرداخت:</Typography>
          <Typography variant="h6" fontWeight="bold" color="#D68240">{finalAmount.toLocaleString()} تومان</Typography>
        </Box>

        {/* دکمه ادامه خرید */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/checkout")} sx={{ fontSize: "1.1rem"}} style={{padding:"10px 15px"}}>
            ادامه خرید
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CartPage;
