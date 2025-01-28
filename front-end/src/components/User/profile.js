import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import FoodiImg from "../../assets/imgs/foodiIcon.png";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleEditClick = () => {
    navigate("/customer/edit-profile");
  };

  const handleSignUpClick = () => {
    navigate("/restuarant/signup");
  };

  const handleFavorites = () => {
    navigate("/customer/favorites");
  };

  const handleOrdersHistory = () => {
    navigate("/customer/orders");
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
        sm={8}
        md={6}
        lg={4}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img
              src={FoodiImg}
              alt="Foodi Logo"
              style={{ width: "80px", cursor: "pointer" }}
            />
          </a>
        </Box>
        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffe5d4",
            p: 2,
            borderRadius: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 48, color: "#ff7a59" }} />
          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                pointerEvents: "none",
                userSelect: "none",
                fontSize: "1rem",
              }}
            >
              {user?.user?.first_name + " " + user?.user?.last_name ||
                "نام و نام خانوادگی"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ pointerEvents: "none", userSelect: "none" }}
            >
              {user?.user?.phone_number || "شماره تلفن"}
            </Typography>
          </Box>
          <IconButton sx={{ mt: { xs: 2, sm: 0 } }} onClick={handleEditClick}>
            <EditIcon sx={{ color: "#ff7a59", fontSize: 25 }} />
          </IconButton>
        </Box>

        {/* Options List */}
        <List
          sx={{
            backgroundColor: "#ffeddf",
            borderRadius: 2,
            mt: 2,
            p: 1,
          }}
        >
          <ListItem button onClick={handleOrdersHistory}>
            <ListItemIcon>
              <ShoppingBagIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="سفارش‌های من" />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button onClick={handleFavorites}>
            <ListItemIcon>
              <FavoriteIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="لیست علاقه‌مندی‌ها" />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button onClick={handleSignUpClick}>
            <ListItemIcon>
              <AssignmentIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="ثبت نام فروشندگان" />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button onClick={handleOpenLogoutDialog}>
            <ListItemIcon>
              <LogoutIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="خروج از حساب کاربری" />
          </ListItem>
        </List>

        <Dialog
          open={openLogoutDialog}
          onClose={handleCloseLogoutDialog}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              padding: "15px 16px",
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle id="logout-dialog-title">تأیید خروج</DialogTitle>
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

export default UserProfilePage;
