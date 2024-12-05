import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://127.0.0.1:8000/api",
	headers: {
		'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access")}`
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const response = await axios.post(
					"http://127.0.0.1:8000/api/auth/token/refresh",
					{
						refresh: localStorage.getItem("refresh"),
					},
				);

				localStorage.setItem("access", response.data.access);
				axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access}`;
				originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

				return axiosInstance(originalRequest);
			} catch (err) {
				// localStorage.clear();
				// window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
