import React from "react";
import { Box, Avatar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext"; // گرفتن اطلاعات کاربر

const UserProfilePage = () => {
  const navigate = useNavigate();

  // انتقال به صفحه ویرایش اطلاعات
  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  const { user } = useUser(); // استفاده از اطلاعات کاربر

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
        minHeight: "80vh",
      }}
    >
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
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.2rem" }}>
            {user?.name || "نام و نام خانوادگی"}
          </Typography>
          <Typography variant="body2">{user?.phone || "شماره تلفن"}</Typography>
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
        <ListItem button sx={{ paddingRight: 2, paddingLeft: 2 }}>
          <ListItemIcon>
            <ShoppingBagIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="سفارش‌های من" />
        </ListItem>
        <Divider sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }} />
        <ListItem button sx={{ paddingRight: 2, paddingLeft: 2 }}>
          <ListItemIcon>
            <FavoriteIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="لیست علاقه‌مندی‌ها" />
        </ListItem>
        <Divider sx={{ borderColor: "#B0B0B0", width: "80%", mx: "auto", my: 1 }} />
        <ListItem button sx={{ paddingRight: 2, paddingLeft: 2 }}>
          <ListItemIcon>
            <AssignmentIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="ثبت نام فروشندگان" />
        </ListItem>
      </List>
    </Box>
  );
};

export default UserProfilePage;
