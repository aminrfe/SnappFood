import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import FoodiImg from "../../assets/imgs/foodiIcon.png";

const RestaurantProfile = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    if (!id) {
      console.error("userId is undefined. Cannot fetch profile data.");
      return;
    }

    try {
      const response = await axiosInstance.get(`/restaurant/profiles/me`);
      const data = response.data;

      if (data) {
        setName(data.name || "");
        const phone = localStorage.getItem("phone");
        setPhoneNumber(phone || "");
      } else {
        console.error("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleProfileEditClick = () => {
    if (id) {
      navigate(`/restaurant/${id}/profileEdit`);
    }
  };

  const handleMenuClick = () => {
    if (id) {
      navigate(`/restaurant/${id}/menu`);
    }
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogOutClick = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
        }}
      >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
          <img
              src={FoodiImg}
              alt="Foodi Logo"
              style={{ width: "80px" }}
          />
      </div>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f5d5c0",
            padding: 2,
            borderRadius: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 0 } }}>
            <Avatar sx={{ bgcolor: "#f28b82", marginRight: 1 }} />
            <Box>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {phoneNumber}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleProfileEditClick}>
            <EditIcon sx={{ color: "#ff7a59", fontSize: 25 }} />
          </IconButton>
        </Box>

        {/* Action Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: 3,
            gap: 2,
          }}
        >
          <Card
            sx={{
              bgcolor: "#f5d5c0",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleMenuClick}
            >
              <RestaurantMenuIcon sx={{ marginRight: 2, color: "#f28b82" }} />
              <Typography>{"منوی فروشگاه"}</Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              bgcolor: "#f5d5c0",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/restaurant/${id}/orders`)}
            >
              <ShoppingBagIcon sx={{ marginRight: 2, color: "#f28b82" }} />
              <Typography>سفارش‌های فروشگاه</Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              bgcolor: "#f5d5c0",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/restaurant/${id}/report`)}
            >
              <DescriptionIcon sx={{ marginRight: 2, color: "#f28b82" }} />
              <Typography>گزارش مالی فروشگاه</Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              bgcolor: "#f5d5c0",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleOpenLogoutDialog}
            >
              <LogoutIcon sx={{ marginRight: 2, color: "#f28b82" }} />
              <Typography>خروج از حساب کاربری</Typography>
            </CardContent>
          </Card>
        </Box>

        <Dialog
          open={openLogoutDialog}
          onClose={handleCloseLogoutDialog}
          sx={{
            "& .MuiDialog-paper": {
              padding: "15px 16px",
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle id="logout-dialog-title">
            تأیید خروج
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="logout-dialog-description">
              آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseLogoutDialog}
              sx={{
                bgcolor: "#e4a073",
                color: "white",
                "&:hover": { bgcolor: "#d48b6c" },
              }}
            >
              خیر
            </Button>
            <Button
              onClick={handleLogOutClick}
              variant="contained"
              sx={{
                bgcolor: "#f57c00",
                "&:hover": { bgcolor: "#e56c00" },
              }}
            >
              بله
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default RestaurantProfile;
