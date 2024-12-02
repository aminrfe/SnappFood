import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const EditProfile = ({ userId }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);
  const [logo, setLogo] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6892, lng: 51.389 });
  const [mapMarker, setMapMarker] = useState({ lat: 35.6892, lng: 51.389 });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/restaurant/profile`);
      const data = response.data;

      setName(data.name || "");
      setAddress(data.address || "");
      setDeliveryCost(data.delivery_price || "");
      setDescription(data.description || "");
      setBusinessType(data.business_type || "");
      setOpeningTime(data.open_hour || null);
      setClosingTime(data.close_hour || null);

      if (data.coordinate) {
        setMapCenter({
          lat: data.coordinate.lat || 35.6892,
          lng: data.coordinate.lng || 51.389,
        });
        setMapMarker({
          lat: data.coordinate.lat || 35.6892,
          lng: data.coordinate.lng || 51.389,
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name,
        address,
        delivery_price: deliveryCost,
        description,
        business_type: businessType,
        open_hour: openingTime,
        close_hour: closingTime,
        coordinate: mapMarker,
      };

      await axiosInstance.put(`/restaurant/${userId}/profile`, payload);

      alert("اطلاعات با موفقیت ذخیره شد.");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("خطا در ذخیره اطلاعات.");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file)); // نمایش تصویر لوگو در حالت پیش‌نمایش
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMapMarker({ lat: latitude, lng: longitude });
          fetchAddress(latitude, longitude); // Fetch address when current location is fetched
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("دسترسی به موقعیت مکانی ممکن نیست.");
        }
      );
    } else {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&language=fa`
      );
      const data = await response.json();

      if (data && data.address) {
        const road = data.address.road || '';
        const neighbourhood = data.address.neighbourhood || '';
        const suburb = data.address.suburb || '';
        const city = data.address.city || '';
        const cityDistrict = data.address.city_district || '';
        const state = data.address.state || ''; // برای منطقه یا استان

        const fullAddress = `${neighbourhood || suburb || ''} ${road || ''} ${cityDistrict || city || ''} ${state || ''}`;
        setAddress(fullAddress.trim());
      } else {
        setAddress("آدرس پیدا نشد");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("خطا در دریافت آدرس.");
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    setMapCenter({ lat, lng }); // Set map center to clicked location
    setMapMarker({ lat, lng }); // Set marker to clicked location
    fetchAddress(lat, lng); // Fetch address when map is clicked
  };

  return (
    <Box
      style={{
        width: "70%",
        height: "100vh",
        margin: "0 auto",
        paddingTop: "80px", // Offset for the fixed header
        paddingRight: "15px",
        paddingLeft: "15px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        style={{
          backgroundColor: "#eead7a",
          padding: "15px",
          position: "fixed",
          top: 0,
          left: "15%",
          width: "70%",
          textAlign: "center",
          zIndex: 1000,
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          ویرایش اطلاعات
        </Typography>
      </Box>

      {/* Profile Form */}
      <Box style={{ display: "flex", flexDirection: "column", gap: "15px"}}>
        {/* Business Type */}
        <FormControl fullWidth style={{backgroundColor:"#fceee3"}}>
          <InputLabel>نوع کسب و کار</InputLabel>
          <Select
            value={businessType}
            onChange={handleFieldChange(setBusinessType)}
            label="نوع کسب و کار"
          >
            <MenuItem value="restaurant">رستوران</MenuItem>
            <MenuItem value="cafe">کافه</MenuItem>
            <MenuItem value="bakery">نانوایی</MenuItem>
            <MenuItem value="sweets">شیرینی</MenuItem>
            <MenuItem value="icecream">آبمیوه و بستنی</MenuItem>
          </Select>
        </FormControl>

        {/* Store Name */}
        <TextField
          value={name}
          placeholder="نام فروشگاه"
          variant="outlined"
          fullWidth
          style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
          onChange={handleFieldChange(setName)}
        />

        {/* Logo Upload */}
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: "none" }}
            id="logo-upload"
          />
          <label htmlFor="logo-upload">
            <Button variant="contained" component="span" fullWidth style={{backgroundColor:"#f0871f"}}>
              بارگذاری لوگو
            </Button>
          </label>
          {logo && <img src={logo} alt="Logo preview" style={{ marginTop: "10px", width: "100px", height: "100px", objectFit: "cover" }} />}
        </Box>


<Grid container spacing={2}>
  <Grid item xs={6}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="ساعت بازگشایی"
        value={openingTime}
        onChange={setOpeningTime}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
          />
        )}
      />
    </LocalizationProvider>
  </Grid>
  <Grid item xs={6}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="ساعت تعطیلی"
        value={closingTime}
        onChange={setClosingTime}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
          />
        )}
      />
    </LocalizationProvider>
  </Grid>
</Grid>

        {/* Google Map */}
        <Box
          style={{
            height: "400px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyD5AZ9092BIIq6gW9SWqdRJ9MBRgTLHLPY", // Replace with your API key
            }}
            center={mapCenter}
            zoom={14}
            onClick={handleMapClick}
          >
            <div
              lat={mapMarker.lat}
              lng={mapMarker.lng}
              style={{
                color: "red",
                fontSize: "24px",
                transform: "translate(-50%, -50%)",
              }}
            >
              <FaMapMarkerAlt />
            </div>
          </GoogleMapReact>
        </Box>

        {/* Current Location Button */}
        <Button
          style={{
            backgroundColor: "#fff",
            color: "white",
            fontWeight: "bold",
            // padding: "10px",
            marginTop: "5px",
            borderRadius: "8px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleGetCurrentLocation}
        >
          <FaMapMarkerAlt  style={{color:"black", marginRight: "5px" }} /> 
        </Button>

        {/* Address */}
        <TextField
          value={address}
          placeholder="آدرس"
          variant="outlined"
          fullWidth
          style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
          onChange={handleFieldChange(setAddress)}
        />

        {/* Description */}
        <TextField
          value={description}
          placeholder="توضیحات فروشگاه"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
          onChange={handleFieldChange(setDescription)}
        />

        {/* Delivery Cost */}
        <TextField
          value={deliveryCost}
          placeholder="هزینه پیک (به تومان)"
          variant="outlined"
          fullWidth
          style={{ backgroundColor: "#fceee3", borderRadius: "8px" }}
          onChange={handleFieldChange(setDeliveryCost)}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#f0871f",
            color: "white",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }}
          onClick={handleSave}
        >
          تایید
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;
