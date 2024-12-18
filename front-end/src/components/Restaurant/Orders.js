import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Divider,
  Dialog,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

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
];

const OrderList = () => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [orderStatuses, setOrderStatuses] = useState({});

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpen(true);
    setStatus(orderStatuses[order.id] || "");
  };

  const handleCloseDialog = () => {
    if (selectedOrder) {
      setOrderStatuses((prev) => ({ ...prev, [selectedOrder.id]: status }));
    }
    setOpen(false);
    setStatus("");
  };

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

      <Grid container justifyContent="center" direction="column" width={900}>
        {orders.map((order) => (
          <Grid item xs={12} md={8} key={order.id} direction="row">
            <Card
              sx={{
                alignItems: "center",
                backgroundColor: "#F4DCC9",
                boxShadow: "none",
                borderRadius: 0,
                overflow: "hidden",
              }}
            >
              <Grid
                container
                sx={{
                  height: "160px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  sx={{
                    flex: "1 1 auto",
                    marginLeft: "1rem",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    {order.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.date} - {order.time}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{
                    marginLeft: "auto",
                    textAlign: "right",
                  }}
                >
                  {orderStatuses[order.id] && (
                    <Typography
                      variant="body2"
                      color="primary"
                      marginBottom={1}
                    >
                      آخرین وضعیت: {orderStatuses[order.id]}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {order.price}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog(order)}
                    sx={{
                      fontWeight: "normal",
                      border: "1px solid #d68240",
                      "&:hover": {
                        color: "#d68240",
                      },
                      marginTop: "0.5rem",
                    }}
                  >
                    وارد کردن وضعیت سفارش
                  </Button>
                </Grid>
              </Grid>
            </Card>
            <Divider sx={{ backgroundColor: "lightGrey" }} />
          </Grid>
        ))}
      </Grid>

      {/* Dialog Component */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(5px)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "1.5rem",
            minWidth: "300px",
            backgroundColor: "#FFF8F1",
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            وضعیت این سفارش را وارد کنید.
          </Typography>

          <FormControl fullWidth>
            <InputLabel>وضعیت سفارش</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="وضعیت سفارش"
              sx={{
                backgroundColor: "#FFEBE1",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <MenuItem value="در حال آماده سازی">در حال آماده سازی</MenuItem>
              <MenuItem value="ارسال شده">ارسال شده</MenuItem>
              <MenuItem value="تحویل داده شده">تحویل داده شده</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" fullWidth onClick={handleCloseDialog}>
            تایید
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default OrderList;
