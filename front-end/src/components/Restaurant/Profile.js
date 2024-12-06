import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DescriptionIcon from "@mui/icons-material/Description";

const RestaurantProfile = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //bgcolor: "#f9f9f9",
        //height: "100vh",
        //padding: 2,
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
    
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#f5d5c0",
          width: "100%",
          maxWidth: 400,
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#f28b82", marginRight: 1 }} />
          <Box>
            <Typography variant="h6">نام فروشگاه</Typography>
            <Typography variant="body2" color="textSecondary">
              شماره تلفن
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <EditIcon sx={{ color: "#ff7a59", fontSize: 25 }}/>
        </IconButton>
      </Box>

      {/* Action Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 400,
          marginTop: 3,
        }}
      >
        {/* Menu  */}
        <Card
          sx={{
            marginBottom: 2,
            bgcolor: "#f5d5c0",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <RestaurantMenuIcon sx={{ marginRight: 2, color: "#f28b82" }} />
            <Typography>منوی فروشگاه</Typography>
          </CardContent>
        </Card>

        {/* Financial Report  */}
        <Card sx={{ bgcolor: "#f5d5c0" }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <DescriptionIcon sx={{ marginRight: 2, color: "#f28b82" }} />
            <Typography>گزارش مالی فروشگاه</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RestaurantProfile;