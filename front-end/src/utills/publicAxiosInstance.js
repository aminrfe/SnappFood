import axios from "axios";

const publicAxiosInstance = axios.create({
	baseURL: "https://snappfood-aghc.onrender.com/api", 
	headers: {
		"Content-Type": "application/json",
	},
});

export default publicAxiosInstance;
