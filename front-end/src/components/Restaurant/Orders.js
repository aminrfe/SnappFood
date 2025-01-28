import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import moment from "moment-jalaali";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../utills/axiosInstance";

const getStatusInFarsi = (status) => {
  switch (status) {
    case "pending":
      return "در انتظار تایید";
    case "preparing":
      return "در حال آماده سازی";
    case "delivering":
      return "ارسال شده";
    case "completed":
      return "تحویل داده شده";
    default:
      return status;
  }
};

const deliveryMethodMap = {
  pickup: "دریافت حضوری",
  delivery: "ارسال با پیک",
};

const paymentMethodMap = {
  in_person: "نقدی",
  online: "آنلاین",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/orders");
      const ordersWithId = response.data.map((order, index) => ({
        ...order,
        id: index + 1,
        status: getStatusInFarsi(order.status),
      }));
      setOrders(ordersWithId);
    } catch (err) {
      console.log("خطا در دریافت اطلاعات");
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    if (selectedOrder) {
      try {
        await axiosInstance.patch(
          `/restaurant/orders/${selectedOrder.order_id}/status`,
          {
            state: status,
          }
        );
      } catch (err) {
        console.error("خطا در به‌روزرسانی وضعیت سفارش:", err);
      }
    }
    fetchOrders();
    setOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        padding: "2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", marginBottom: "2rem" }}
      >
        لیست سفارش‌ها
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          سفارشی در لیست شما وجود ندارد
        </Typography>
      ) : (
        orders.map((order, index) => (
<Accordion
            key={order.id}
            sx={{ marginBottom: "1rem", width: "70%", boxShadow: "none" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor:
                  order.state === "completed" ? "#DFF6DD" : "#F4DCC9",
                padding: "1rem",
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "20px",
                borderRadius: "20px",
              }}
            >
              <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  سفارش شماره {index + 1}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  تاریخ سفارش:{" "}
                  {moment(order.order_date).format("jYYYY/jMM/jDD")} در ساعت{" "}
                  {moment(order.order_date).format("HH:mm")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  روش ارسال: {deliveryMethodMap[order.delivery_method]}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  روش پرداخت: {paymentMethodMap[order.payment_method]}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  آدرس: {order.address}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  وضعیت فعلی: {getStatusInFarsi(order.state)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  قیمت کل: {Math.floor(order.total_price).toLocaleString()} تومان
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "#FFF8F1",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {/* Left-side content */}
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    آیتم‌های سفارش:
                  </Typography>
                  <List>
                    {order.order_items.map((item, idx) => (
                      <ListItem
                        key={idx}
                        sx={{ paddingLeft: 0, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        <ListItemText
                          primary={`${item.name} - تعداد: ${item.count}`}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    توضیحات سفارش:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {order.description || "بدون توضیحات"}
                  </Typography>
                </Box>

                {/* Right-side button */}
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog(order)}
                  disabled={order.state === "completed"}
                  sx={{
                    fontWeight: "normal !important",
                    alignSelf: "flex-start",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  وارد کردن وضعیت سفارش
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

        ))
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
              <MenuItem value="preparing">در حال آماده سازی</MenuItem>
              <MenuItem value="delivering">ارسال شده</MenuItem>
              <MenuItem value="completed">تحویل داده شده</MenuItem>
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
