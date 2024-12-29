import React, { useState, useEffect } from "react";
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
    navigate("/user/edit-profile");
  };

  const handleSignUpClick = () => {
    navigate("/restuarant/signup");
  };

  const handleFavorites = () => {
    navigate("/favorites");
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
    <Box
      sx={{
        maxWidth: 450,
        width: "40%",
        margin: "auto",
        mt: 4,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        minHeight: "100vh",
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
        <img
          onClick={() => navigate("/")}
          src={FoodiImg}
          alt="Foodi Logo"
          style={{
            width: "100px",
            cursor: "pointer",
          }}
        />
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
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 48, color: "#ff7a59" }} />
        <Box sx={{ marginLeft: "4px" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              pointerEvents: "none",
              userSelect: "none",
              fontSize: "1.2rem",
            }}
          >
            {user.user.first_name + " " + user.user.last_name ||
              "نام و نام خانوادگی"}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ pointerEvents: "none", userSelect: "none" }}
          >
            {" "}
            {user.user.phone_number || "شماره تلفن"}
          </Typography>
        </Box>
        <IconButton sx={{ ml: 2 }} onClick={handleEditClick}>
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
        <ListItem
          button
          style={{ cursor: "pointer" }}
          sx={{ paddingRight: 2, paddingLeft: 2 }}
        >
          <ListItemIcon>
            <ShoppingBagIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="سفارش‌های من" />
        </ListItem>
        <Divider
          sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }}
        />
        <ListItem
          button
          onClick={handleFavorites}
          style={{ cursor: "pointer" }}
          sx={{ paddingRight: 2, paddingLeft: 2 }}
        >
          <ListItemIcon>
            <FavoriteIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="لیست علاقه‌مندی‌ها" />
        </ListItem>
        <Divider
          sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }}
        />
        <ListItem
          button
          style={{ cursor: "pointer" }}
          sx={{ paddingRight: 2, paddingLeft: 2 }}
        >
          <ListItemIcon>
            <AssignmentIcon color="warning" />
          </ListItemIcon>
          <ListItemText
            onClick={handleSignUpClick}
            primary="ثبت نام فروشندگان"
          />
        </ListItem>
        <Divider
          sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }}
        />
        <ListItem
          button
          style={{ cursor: "pointer" }}
          sx={{ paddingRight: 2, paddingLeft: 2 }}
        >
          <ListItemIcon>
            <LogoutIcon color="warning" />
          </ListItemIcon>
          <ListItemText
            onClick={handleOpenLogoutDialog}
            primary="خروج از حساب کاربری"
          />
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
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            padding: "10px 8px",
            fontSize: "18px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          تأیید خروج
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "8px 8px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <DialogContentText id="logout-dialog-description">
            آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "8px 8px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Button
            onClick={handleCloseLogoutDialog}
            sx={{
              bgcolor: "#e4a073",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#d48b6c",
              },
            }}
          >
            خیر
          </Button>
          <Button
            onClick={handleLogOutClick}
            variant="contained"
            sx={{
              bgcolor: "#f57c00",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#e56c00",
              },
            }}
          >
            بله
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfilePage;
